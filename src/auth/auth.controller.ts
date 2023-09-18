import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Res,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login Success!!')
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Register Success A New User!!')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.handleRegister(registerUserDto);
  }

  @Get('/account')
  @ResponseMessage('Get Account Success A New User!!')
  async handleGetAccount(@User() user: IUser) {
    const roleId = new mongoose.Types.ObjectId(user.role?._id).toString();
    const temp = (await this.rolesService.findOne(roleId)) as any;
    user.permissions = temp?.permissions;
    return {
      data: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  @Public()
  @ResponseMessage('Get User By Refresh Token Success!!')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout User Success!!')
  handleLogoutUser(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
    // response thường hay làm việc với refresh token ở cookies
  ) {
    return this.authService.handleLogoutUser(user, response);
  }
}
