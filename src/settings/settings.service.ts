import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Settings } from "./entities/settings.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async findOne() {
    let settings = await this.settingsRepository.findOneBy({ id: 1 });

    if (!settings) {
      settings = this.settingsRepository.create({
        id: 1,
        openingBalance: 0,
        incomeSources: ["Salary", "Bonus", "Other"],
        expenseSources: ["Food", "Rent", "Transport", "Other"],
        monthlyBudgets: {},
      });

      settings = await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.findOne();

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }
}