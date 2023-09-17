import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/Schema/permission.schema';
export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role {
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Name' })
  name: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your Description' })
  description: string;
  @Prop()
  @IsNotEmpty({ message: 'Please Enter Your IsActive' })
  @IsBoolean({ message: 'Please Enter Your Boolean' })
  isActive: boolean;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: mongoose.Schema.Types.ObjectId[];
  @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
  @Prop()
  deletedAt: Date;
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
export const RoleSchema = SchemaFactory.createForClass(Role);
