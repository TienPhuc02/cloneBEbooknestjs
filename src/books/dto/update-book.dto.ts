import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsNotEmpty({ message: 'Please Enter Your Thumbnail' })
    thumbnail: string;
    @IsArray({message:"Please Enter Your Array"})
    slider: string[];
    @IsNotEmpty({ message: 'Please Enter Your mainText' })
    mainText: string;
    @IsNotEmpty({ message: 'Please Enter Your Author' })
    author: string;
    @IsNotEmpty({ message: 'Please Enter Your Price' })
    price:number
    @IsNotEmpty({ message: 'Please Enter Your Sold' })
    sold: number;
    @IsNotEmpty({ message: 'Please Enter Your Quantity' })
    quantity: number;
    @IsNotEmpty({ message: 'Please Enter Your Quantity' })
    category: string;
}
