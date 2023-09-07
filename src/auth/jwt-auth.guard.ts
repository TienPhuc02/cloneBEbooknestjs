import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

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
  //canActivate:  Phương thức này được ghi đè từ AuthGuard và được gọi khi NestJS kiểm tra xem có nên cho phép yêu cầu đi tiếp hay không. Trong phương thức này, trước khi xác thực yêu cầu, nó kiểm tra metadata được đặt bởi decorator @Public (sử dụng this.reflector.getAllAndOverride). Nếu isPublic là true, thì nó cho phép yêu cầu đi tiếp mà không cần xác thực JWT. Nếu isPublic là false, nó sẽ gọi phương thức super.canActivate(context) để xác thực JWT.
  

  //trả ra lỗi
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ');
    }
    return user;
  }
  //Phương thức này được gọi sau khi xác thực JWT. Nếu có lỗi (err) hoặc không có người dùng (!user), nó sẽ ném một ngoại lệ UnauthorizedException với thông báo "Token không hợp lệ". Nếu xác thực thành công, nó trả về đối tượng người dùng.
}
//JwtAuthGuard là một guard rất hữu ích để bảo vệ các route trong ứng dụng của bạn, đảm bảo rằng chỉ những yêu cầu có token JWT hợp lệ mới được phép truy cập