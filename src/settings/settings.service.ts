import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const settings = this.settingsRepository.create({
      openingBalance: 0,
      incomeSources: ['Salary', 'Bonus', 'Other'],
      expenseSources: ['Food', 'Rent', 'Transport', 'Other'],
      monthlyBudgets: {},
      user: { id: userId } as User,
    });

    return this.settingsRepository.save(settings);
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
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto, userId: number) {
    const settings = await this.findOne(userId);

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }
}
