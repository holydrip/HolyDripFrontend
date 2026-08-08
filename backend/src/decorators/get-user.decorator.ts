import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../api/user/user.entity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export const GetUser = createParamDecorator(
  (data: keyof RequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return data ? request.user?.[data] : request.user;
  },
);
