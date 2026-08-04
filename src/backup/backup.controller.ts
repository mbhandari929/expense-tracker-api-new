import { Body, Controller, Put } from "@nestjs/common";
import { BackupService } from "./backup.service";
import { RestoreBackupDto } from "./dto/restore-backup.dto";

@Controller("backup")
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Put("restore")
  restore(@Body() restoreBackupDto: RestoreBackupDto) {
    return this.backupService.restore(restoreBackupDto);
  }
}