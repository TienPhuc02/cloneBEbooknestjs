import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/orders/Schema/order.schema';
import { User } from 'src/users/Schema/user.schema';

@Schema({ timestamps: true })
export class History {
  @Prop()
  name: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Order.name }] })
  orders: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;
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

export const HistorySchema = SchemaFactory.createForClass(History);
