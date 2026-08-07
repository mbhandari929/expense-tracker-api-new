import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class BackupApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredApiKey = process.env.BACKUP_API_KEY;

    if (!configuredApiKey) {
      throw new ForbiddenException(
        'Backup restore is disabled because BACKUP_API_KEY is not configured',
      );
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const headerValue = request.headers['x-api-key'];
    const requestApiKey = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;

    if (!requestApiKey) {
      throw new UnauthorizedException('Backup API key is required');
    }

    const requestKeyBuffer = Buffer.from(requestApiKey);
    const configuredKeyBuffer = Buffer.from(configuredApiKey);

    if (
      requestKeyBuffer.length !== configuredKeyBuffer.length ||
      !timingSafeEqual(requestKeyBuffer, configuredKeyBuffer)
    ) {
      throw new UnauthorizedException('Invalid backup API key');
    }

    return true;
  }
}
