import { Module } from '@nestjs/common';
import { BackupApiKeyGuard } from './backup-api-key.guard';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
  controllers: [BackupController],
  providers: [BackupService, BackupApiKeyGuard],
})
export class BackupModule {}
