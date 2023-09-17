import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto, CreateOrderDto } from './create-order.dto';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDetailDto {
    @IsString()
    bookName: string;
  
    @IsNumber()
    quantity: number;
  
    @IsString()
    _id: string;
  }
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
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
  detail: UpdateOrderDetailDto[];
}
