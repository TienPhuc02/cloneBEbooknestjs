import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log("🚀 ~ file: auth.service.ts:14 ~ AuthService ~ validateUser ~ user:", user)
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async handleRegister(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);
    //chuuyển thông tin qua usersService vì usersService đang chọc xuống database chọc xuống model User, và usersService có khả năng hashPassword
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }
}
