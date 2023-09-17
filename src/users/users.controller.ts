import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create User  Success!!')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return {
      newUser,
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }
  @Post('/bulk-create')
  @ResponseMessage('Create List User  Success!!')
  async createListUser(@Body() userList: CreateUserDto[], @User() user: IUser) {
    const newListUser = await this.usersService.createListUser(userList, user);
    return newListUser;
  }

  @Get(':id')
  @ResponseMessage('Get User With Id Success!!')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Get()
  @ResponseMessage('Get User With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(current, pageSize, qs);
  }

  @Put(':id')
  @ResponseMessage('Updated User Success!!')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    const newUser = await this.usersService.update(id, updateUserDto, user);
    return newUser;
  }
  @Patch(':id')
  @ResponseMessage('Updated User Success!!')
  async updateInfo(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    const newUser = await this.usersService.updateInfo(id, updateUserDto, user);
    return newUser;
  }
  @Delete(':id')
  @ResponseMessage('Deleted User Success!!')
  async remove(@Param('id') id: string, @User() user: IUser) {
    const newUser = await this.usersService.remove(id, user);
    return newUser;
  }
  @Post('/change-password')
  @ResponseMessage('Thay đổi mật khẩu thành công')
  async changePassword(
    @Body('email') email: string,
    @Body('oldpass') oldPassword: string,
    @Body('newpass') newPassword: string,
  ) {
    return this.usersService.changePassword(email, oldPassword, newPassword);
  }
}
