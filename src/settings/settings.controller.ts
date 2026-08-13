import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findOne(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.settingsService.findOne(user.sub);
  }

  @Patch()
  update(
    @Body() updateSettingsDto: UpdateSettingsDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.settingsService.update(updateSettingsDto, user.sub);
  }
}
