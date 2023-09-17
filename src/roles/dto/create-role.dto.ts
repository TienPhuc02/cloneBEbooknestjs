import { Prop } from "@nestjs/mongoose";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
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
    @Prop()
    @IsNotEmpty({ message: 'Please Enter Your Permission' })
    @IsArray({ message: 'permission có dạng là array' })
    permissions: mongoose.Schema.Types.ObjectId[];
}
