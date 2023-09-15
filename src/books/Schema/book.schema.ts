import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Thumbnail' })
  thumbnail: string;
  @Prop({ type: mongoose.Schema.Types.Array })
  @IsArray({ message: 'Please Enter Your Array' })
  slider: string[];
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your mainText' })
  mainText: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Author' })
  author: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Price' })
  price: number;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Sold' })
  sold: number;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Quantity' })
  quantity: number;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Quantity' })
  category: string;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  deletedAt: Date;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop({ default: false })
  isDeleted: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
