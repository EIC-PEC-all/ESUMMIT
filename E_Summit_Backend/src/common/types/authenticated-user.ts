import { Role } from '@prisma/client';

/** The principal attached to `request.user` after JwtAuthGuard succeeds. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

/** Shape of a signed access-token payload. */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}
