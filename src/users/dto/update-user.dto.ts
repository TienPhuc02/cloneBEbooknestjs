
import { IsEmail, IsEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmpty({ message: 'Please Enter Your avatar' })
  avatar: string;
  @IsEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
}

export class UpdateUserInfo{
  @IsEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
  @IsEmpty({ message: 'Please Enter Your Avatar' })
  avatar: string;
}