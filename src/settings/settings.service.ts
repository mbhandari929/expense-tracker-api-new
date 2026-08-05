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
    await this.settingsRepository
      .createQueryBuilder()
      .insert()
      .into(Settings)
      .values({
        id: 1,
        openingBalance: 0,
        incomeSources: ["Salary", "Bonus", "Other"],
        expenseSources: ["Food", "Rent", "Transport", "Other"],
        monthlyBudgets: {},
      })
      .orIgnore()
      .execute();

    return this.settingsRepository.findOneByOrFail({ id: 1 });
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.findOne();

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }
}