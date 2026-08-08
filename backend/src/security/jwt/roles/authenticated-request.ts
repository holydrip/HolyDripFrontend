import { Request } from 'express';
import { Role } from '@prisma/client';

export default interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: Role;
  };
}