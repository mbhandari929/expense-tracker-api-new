import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import type {
  AuthenticatedUser,
  RequestWithOptionalUser,
} from '../common/types/authenticated-request';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();

    const token =
      this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'JWT token is required',
      );
    }

    let payload: AuthenticatedUser;

    try {
      payload =
        await this.jwtService.verifyAsync<AuthenticatedUser>(
          token,
        );
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }

    // A database lookup is intentional here.
    // tokenVersion is compared with the current user record so that
    // access tokens issued before a password change are invalidated immediately.
    const user =
      await this.usersService.findById(
        payload.sub,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }

    if (
      payload.tokenVersion !==
      user.tokenVersion
    ) {
      throw new UnauthorizedException(
        'Session has expired. Please log in again.',
      );
    }

    request.user = payload;

    return true;
  }

  private extractTokenFromHeader(
    request: RequestWithOptionalUser,
  ): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(
        ' ',
      ) ?? [];

    return type === 'Bearer'
      ? token
      : undefined;
  }
}