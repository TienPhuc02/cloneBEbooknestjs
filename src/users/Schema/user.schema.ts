import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsNotEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Password' })
  password: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Role' })
  role: string;
  @Prop()
  avatar: string;
  @Prop()
  id?: string;
  @Prop()
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
  isDeleted: boolean;
  @Prop({ default: false })
  deleteAt: Date;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
