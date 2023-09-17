import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Your Description' })
  description: string;
  @IsNotEmpty({ message: 'Please Enter Your IsActive' })
  @IsBoolean({ message: 'Please Enter Your Boolean' })
  isActive: boolean;
  @IsNotEmpty({ message: 'Please Enter Your Permission' })
  @IsArray({ message: 'permission có dạng là array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
