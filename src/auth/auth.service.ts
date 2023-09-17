import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        const userRole = user.role as unknown as { _id: string; name: string };
        console.log("🚀 ~ file: auth.service.ts:26 ~ AuthService ~ validateUser ~ userRole:", userRole)
        const role = await this.rolesService.findOne(userRole._id);
        const objUser = {
          ...user.toObject(),
          permissions: role?.permissions ?? [],
        };
        console.log("🚀 ~ file: auth.service.ts:29 ~ AuthService ~ validateUser ~ objUser:", objUser)
        return objUser;
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
    const { _id, email, fullName, role, phone, permissions } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      fullName,
      phone,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, _id);
    response.clearCookie('refresh_token');
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: email,
        phone: phone,
        fullName: fullName,
        role: role,
        id: _id,
        permissions: user.permissions,
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
  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, fullName, email, role, phone } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          fullName,
          phone,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //check xem đúng với refresh token của user tạo refresh token đấy hay không

        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);
        //set cookies as refresh token
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000,
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            fullName,
            email,
            phone,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      }
    } catch (error) {
      throw new BadRequestException(`Access Token không hợp lệ.Vui lòng login`);
    }
  };
  handleLogoutUser = async (user: IUser, response: Response) => {
    this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Logout Success';
  };
}
