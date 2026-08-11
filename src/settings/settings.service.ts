import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './entities/settings.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async findOne(userId: number) {
    let settings = await this.settingsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        openingBalance: 0,
        incomeSources: ['Salary', 'Bonus', 'Other'],
        expenseSources: ['Food', 'Rent', 'Transport', 'Other'],
        monthlyBudgets: {},
        user: { id: userId } as User,
      });

      settings = await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto, userId: number) {
    const settings = await this.findOne(userId);

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }
}
