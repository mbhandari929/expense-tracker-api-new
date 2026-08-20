import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { SettingsService } from '../settings/settings.service';
import { MailService } from '../mail/mail.service';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
const RESET_TOKEN_EXPIRY_MINUTES = 15;
const PASSWORD_RESET_RESPONSE =
  'If an account with that email exists, a password reset link has been sent.';
const DUMMY_PASSWORD_HASH =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly settingsService: SettingsService,
  ) {}

  async register(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = userRepository.create({
        email: normalizedEmail,
        password: hashedPassword,
      });

      await userRepository.save(user);

      await this.settingsService.createDefaultInTransaction(manager, user);
      return {
        id: user.id,
        email: user.email,
      };
    });
  }

  async login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);

    const user =
      await this.usersService.findByEmailWithPassword(normalizedEmail);

    if (!user) {
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.validateNewPassword(newPassword, user.password);

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePasswordAndInvalidateSessions(
      user.id,
      hashedNewPassword,
    );

    return {
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = this.normalizeEmail(email);

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      return {
        message: PASSWORD_RESET_RESPONSE,
      };
    }

    const previousTokenHash = user.resetPasswordTokenHash;

    const previousExpiresAt = user.resetPasswordExpiresAt;

    const resetToken = randomBytes(32).toString('hex');

    const resetTokenHash = createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000,
    );

    try {
      await this.usersService.savePasswordResetToken(
        user.id,
        resetTokenHash,
        expiresAt,
      );

      await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      try {
        await this.usersService.restorePasswordResetToken(
          user.id,
          previousTokenHash,
          previousExpiresAt,
        );
      } catch (rollbackError) {
        this.logger.error(
          `Failed to restore password reset token for user ${user.id}`,
          rollbackError instanceof Error
            ? rollbackError.stack
            : String(rollbackError),
        );
      }

      this.logger.error(
        `Password reset email could not be sent for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return {
      message: PASSWORD_RESET_RESPONSE,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const resetTokenHash = createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await this.usersService.findByValidResetToken(resetTokenHash);

    if (!user) {
      throw new BadRequestException(
        'Password reset link is invalid or has expired',
      );
    }

    await this.validateNewPassword(newPassword, user.password);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePasswordAndInvalidateSessions(
      user.id,
      hashedPassword,
    );

    return {
      message: 'Password reset successfully',
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async validateNewPassword(
    newPassword: string,
    currentPasswordHash: string,
  ): Promise<void> {
    const isSamePassword = await bcrypt.compare(
      newPassword,
      currentPasswordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }
  }
}
