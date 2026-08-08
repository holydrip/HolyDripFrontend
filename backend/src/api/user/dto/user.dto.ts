import { Role } from '@prisma/client';

export class UserDto {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
