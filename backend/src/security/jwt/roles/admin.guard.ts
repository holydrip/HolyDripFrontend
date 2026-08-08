import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import AuthenticatedRequest from './authenticated-request';
import { NoPermissionException } from '../../exceptions/no-permission.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (user?.role !== Role.ADMIN) {
      throw new NoPermissionException();
    }
    return true;
  }
}
