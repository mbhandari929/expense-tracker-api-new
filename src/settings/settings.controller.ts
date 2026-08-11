import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
  };
};

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findOne(@Req() request: AuthenticatedRequest) {
    return this.settingsService.findOne(request.user.sub);
  }

  @Patch()
  update(
    @Body() updateSettingsDto: UpdateSettingsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.settingsService.update(updateSettingsDto, request.user.sub);
  }
}
