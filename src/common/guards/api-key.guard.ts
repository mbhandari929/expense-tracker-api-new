import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredApiKey = process.env.API_KEY;

    if (!configuredApiKey) {
      throw new ServiceUnavailableException(
        'API authentication is not configured',
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
      throw new UnauthorizedException('API key is required');
    }

    const requestKeyBuffer = Buffer.from(requestApiKey);
    const configuredKeyBuffer = Buffer.from(configuredApiKey);

    if (
      requestKeyBuffer.length !== configuredKeyBuffer.length ||
      !timingSafeEqual(requestKeyBuffer, configuredKeyBuffer)
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
