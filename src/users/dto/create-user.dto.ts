import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsNotEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @IsNotEmpty({ message: 'Please Enter Your Password' })
  password: string;
  @IsNumber({}, { message: 'Please Enter Your Number' })
  @IsNotEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
  @IsNotEmpty({ message: 'Please Enter Your Role' })
  role: string;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsNotEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @IsNotEmpty({ message: 'Please Enter Your Password' })
  password: string;
  @IsNumber({}, { message: 'Please Enter Your Number' })
  @IsNotEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
}
