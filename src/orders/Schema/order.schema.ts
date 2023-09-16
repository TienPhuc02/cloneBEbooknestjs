import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export class CreateOrderDetailDto {
  @IsString()
  bookName: string;

  @IsNumber()
  quantity: number;

  @IsString()
  _id: string;
}
@Schema({ timestamps: true })
export class Order {
  @Prop()
  name: string;
  @Prop()
  address: string;
  @Prop()
  phone: string;
  @Prop()
  totalPrice: number;
  @Prop()
  @IsArray()
  @ValidateNested({ each: true }) // Đảm bảo kiểm tra từng object trong mảng
  @Type(() => CreateOrderDetailDto)
  detail: CreateOrderDetailDto[];
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

export const OrderSchema = SchemaFactory.createForClass(Order);
