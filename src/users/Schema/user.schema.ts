import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/Schema/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  @IsNotEmpty({ message: 'Please Enter Your Role' })
  role: string;
  @Prop()
  avatar: string;
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
  @Prop()
  refreshToken: string;
  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
