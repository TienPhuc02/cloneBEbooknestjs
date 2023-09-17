import { Prop } from "@nestjs/mongoose";
import { IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
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
    @IsMongoId({ message: 'Each Permission is mongo object id' })
    permission: mongoose.Schema.Types.ObjectId[];
}
