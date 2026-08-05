import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class BackupApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredApiKey = process.env.BACKUP_API_KEY;

    if (!configuredApiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new ForbiddenException(
          "Backup restore is disabled in production",
        );
      }

      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const headerValue = request.headers["x-api-key"];
    const requestApiKey = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;

    if (requestApiKey !== configuredApiKey) {
      throw new UnauthorizedException("Invalid backup API key");
    }

    return true;
  }
}