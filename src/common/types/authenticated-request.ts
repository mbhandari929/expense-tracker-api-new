import type { Request } from 'express';

export type AuthenticatedUser = {
  sub: number;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

export type RequestWithOptionalUser = Request & {
  user?: AuthenticatedUser;
};
