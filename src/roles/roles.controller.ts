import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a New Role Success')
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    const newRole = await this.rolesService.create(createRoleDto, user);
    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Get a New Role with Pagination Success')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(current, pageSize, qs);
  }
  @Get(':id')
  @ResponseMessage('Get a New Role By Id Success')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a New Role Success')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    const newUpdateRole = await this.rolesService.update(
      id,
      updateRoleDto,
      user,
    );
    return newUpdateRole;
  }

  @Delete(':id')
  remove(@Param('id') id: string ,@User() user:IUser) {
    return this.rolesService.remove(id,user);
  }
}
