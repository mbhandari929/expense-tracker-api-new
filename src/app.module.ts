import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BackupModule } from './backup/backup.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        type: 'better-sqlite3',
        database:
          configService.get<string>(
            'DATABASE_PATH',
          ) ?? 'expense.db',
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    IncomeModule,
    ExpenseModule,
    SettingsModule,
    BackupModule,
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}