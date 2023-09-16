
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';


export class CreateOrderDetailDto {
  @IsString()
  bookName: string;

  @IsNumber()
  quantity: number;

  @IsString()
  _id: string;
}
export class CreateOrderDto {
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;

  @IsNotEmpty({ message: 'Please Enter Your address' })
  address: string;

  @IsNotEmpty({ message: 'Please Enter Your phone' })
  phone: string;

  @IsNotEmpty({ message: 'Please Enter Your totalPrice' })
  totalPrice: number;
  @IsArray()
  @ValidateNested({ each: true }) // Đảm bảo kiểm tra từng object trong mảng
  @Type(() => CreateOrderDetailDto)
  detail: CreateOrderDetailDto[];
}
