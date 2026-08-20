import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  findByIdWithPassword(id: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  create(email: string, password: string) {
    const user = this.userRepository.create({
      email,
      password,
    });

    return this.userRepository.save(user);
  }

  async deleteById(userId: number) {
    await this.userRepository.delete(userId);
  }
  // Updates the password, invalidates existing JWT sessions,
  // and clears any active password reset token.
  async updatePasswordAndInvalidateSessions(
    userId: number,
    hashedPassword: string,
  ) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        password: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
        tokenVersion: () => 'tokenVersion + 1',
      })
      .where('id = :userId', { userId })
      .execute();
  }

  async savePasswordResetToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ) {
    await this.userRepository.update(userId, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    });
  }

  async restorePasswordResetToken(
    userId: number,
    tokenHash: string | null,
    expiresAt: Date | null,
  ) {
    await this.userRepository.update(userId, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    });
  }

  findByValidResetToken(tokenHash: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.resetPasswordTokenHash = :tokenHash', { tokenHash })
      .andWhere('user.resetPasswordExpiresAt > :now', { now: new Date() })
      .getOne();
  }
}
