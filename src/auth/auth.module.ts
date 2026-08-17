import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';

import { MailModule } from '../mail/mail.module';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    SettingsModule,
    ConfigModule,
    MailModule,

    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60_000,
          limit: 60,
        },
      ],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => {
        const secret =
          configService.get<string>(
            'JWT_SECRET',
          );

        if (!secret) {
          throw new Error(
            'JWT_SECRET is not configured',
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}