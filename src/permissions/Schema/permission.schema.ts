import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission {
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your ApiPath' })
  apiPath: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Method' })
  method: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Module' })
  module: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  isDeleted: boolean;
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
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
