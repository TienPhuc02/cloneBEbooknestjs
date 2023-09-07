import { Controller, Post, Req, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Register Success A New User!!')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.handleRegister(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
