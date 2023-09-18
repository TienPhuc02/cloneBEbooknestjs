
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsNotEmpty({ message: 'Please Enter Your avatar' })
  avatar: string;
  @IsNotEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
}

export class UpdateUserInfo{
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsNotEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
  @IsNotEmpty({ message: 'Please Enter Your Avatar' })
  avatar: string;
}