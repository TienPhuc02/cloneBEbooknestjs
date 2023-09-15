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
    return newUser;
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Delete(':id')
  @ResponseMessage('Deleted User Success!!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
