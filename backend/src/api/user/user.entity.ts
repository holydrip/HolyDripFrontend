import { RefreshToken, Role } from '@prisma/client';
export class UserEntity {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  password: string;
  address: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  tokens?: RefreshToken[];
}
