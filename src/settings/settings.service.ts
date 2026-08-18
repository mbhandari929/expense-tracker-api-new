import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async createDefault(userId: number) {
    return this.createDefaultWithRepository(this.settingsRepository, {
      id: userId,
    } as User);
  }

  async createDefaultInTransaction(manager: EntityManager, user: User) {
    const settingsRepository = manager.getRepository(Settings);

    return this.createDefaultWithRepository(settingsRepository, user);
  }

  async findOne(userId: number) {
    const settings = await this.settingsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!settings) {
      return this.createDefault(userId);
    }

    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto, userId: number) {
    const settings = await this.findOne(userId);

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }

  private createDefaultWithRepository(
    repository: Repository<Settings>,
    user: User,
  ) {
    const settings = repository.create({
      openingBalance: 0,
      incomeSources: ['Salary', 'Bonus', 'Other'],
      expenseSources: ['Food', 'Rent', 'Transport', 'Other'],
      monthlyBudgets: {},
      user,
    });

    return repository.save(settings);
  }
}
