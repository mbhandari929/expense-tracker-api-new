import { Body, Controller, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { BackupService } from './backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Put('restore')
  restore(
    @Body() restoreBackupDto: RestoreBackupDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.backupService.restore(restoreBackupDto, user.sub);
  }
}
