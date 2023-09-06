import { IsEmail, IsEmpty } from 'class-validator';
import mongoose from 'mongoose';
export class CreateUserDto {
  @IsEmpty({ message: 'Please Enter Your Email' })
  fullName: string;
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @IsEmpty({ message: 'Please Enter Your Email' })
  password: string;
  @IsEmpty({ message: 'Please Enter Your Email' })
  phone: number;
}
