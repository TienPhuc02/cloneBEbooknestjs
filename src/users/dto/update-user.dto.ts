
import { IsEmail, IsEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @IsEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
}
