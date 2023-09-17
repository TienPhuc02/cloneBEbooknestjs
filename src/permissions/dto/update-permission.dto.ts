import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;

  @IsNotEmpty({ message: 'Please Enter Your ApiPath' })
  apiPath: string;

  @IsNotEmpty({ message: 'Please Enter Your Method' })
  method: string;

  @IsNotEmpty({ message: 'Please Enter Your Module' })
  module: string;
}
