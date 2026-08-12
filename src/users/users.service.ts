import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

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

  findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  create(email: string, password: string) {
    const user = this.userRepository.create({
      email,
      password,
    });

    return this.userRepository.save(user);
  }

  async updatePassword(userId: number, hashedPassword: string) {
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
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

  findByValidResetToken(tokenHash: string) {
    return this.userRepository.findOne({
      where: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: MoreThan(new Date()),
      },
    });
  }

  async clearPasswordResetToken(userId: number) {
    await this.userRepository.update(userId, {
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
    });
  }
}
