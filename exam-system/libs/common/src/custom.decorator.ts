/**
 * 自定义装饰器
 */
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

interface RequestWithUser extends Request {
  user?: any;
}

export const RequireLogin = () => SetMetadata('require-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
