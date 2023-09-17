import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;

  @IsNotEmpty({ message: 'Please Enter Your ApiPath' })
  apiPath: string;

  @IsNotEmpty({ message: 'Please Enter Your Method' })
  method: string;

  @IsNotEmpty({ message: 'Please Enter Your Module' })
  module: string;
}
