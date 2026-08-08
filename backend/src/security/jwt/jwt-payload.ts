import { Role } from '@prisma/client';

export class JwtPayload {
  sub: string;
  role: Role;
}
