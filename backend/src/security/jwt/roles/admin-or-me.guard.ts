import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AuthenticatedRequest from './authenticated-request';
import { Role } from '@prisma/client';
import { NoPermissionException } from '../../exceptions/no-permission.exception';

@Injectable()
export class AdminOrMeGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (user.role === Role.ADMIN) {
      return true;
    }

    const targetUserId = request.params.id || request.params.userId;
    if (user.id !== targetUserId) {
      throw new NoPermissionException();
    }

    return true;
  }
}
