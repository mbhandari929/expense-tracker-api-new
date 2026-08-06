import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupApiKeyGuard } from './backup-api-key.guard';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Put('restore')
  @UseGuards(BackupApiKeyGuard)
  restore(@Body() restoreBackupDto: RestoreBackupDto) {
    return this.backupService.restore(restoreBackupDto);
  }
}
