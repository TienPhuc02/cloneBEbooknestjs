import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }
  createRefreshToken = (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  async login(user: IUser, response: Response) {
    const { _id, email, fullName, role, avatar, phone } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      fullName,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, _id);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) *1000,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: email,
        phone: phone,
        fullName: fullName,
        role: role,
        id: _id,
      },
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
