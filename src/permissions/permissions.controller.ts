import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Create A Permission Success!!')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    const newPermission = await this.permissionsService.create(
      createPermissionDto,
      user,
    );
    return {
      _id: newPermission?._id,
      createAt: newPermission?.createdAt,
    };
  }
  @Get()
  @ResponseMessage('Get Permission With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Permission With Id Success!!')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update Permission Success!!')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Remove A Permission Success!!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
