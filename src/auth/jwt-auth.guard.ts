import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
import path from 'path';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // xác thức Public là true hay false,nếu false thì  giải mã jwt còn true thì ngược lại
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  //khong public
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ/không có Bearer Token ở Header',
          )
          );
        }
        //ley request
        const request: Request = context.switchToHttp().getRequest();
        //check permission
        const targetMethod = request.method;
        const targetEndpoint = request.route?.path;
  
        const permissions = user?.user?.permissions ?? [];
        const isExist = permissions.find(
          permission=>
            targetMethod === permission.method &&
            targetEndpoint === permission.apiPath,
        );
        if (!isExist) {
          throw new ForbiddenException(
            'Bạn không có quyền để truy cập end point này',
          );
        }
        return user;
  }
}
