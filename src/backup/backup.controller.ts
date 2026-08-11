import { Body, Controller, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { BackupService } from './backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
  };
};

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Put('restore')
  restore(
    @Body() restoreBackupDto: RestoreBackupDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.backupService.restore(restoreBackupDto, request.user.sub);
  }
}
