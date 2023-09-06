
import { IsEmail, IsEmpty } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {
//cách tạo một DTO (Data Transfer Object) mới có tên UpdateCatDto, bằng cách mở rộng từ một DTO khác có tên CreateCatDto và thêm từ khóa PartialType vào trước nó.cách tạo một DTO (Data Transfer Object) mới có tên UpdateCatDto, bằng cách mở rộng từ một DTO khác có tên CreateCatDto và thêm từ khóa PartialType vào trước nó.
export class UpdateUserDto {
  @IsEmpty({ message: 'Please Enter Your FullName' })
  fullName: string;
  @IsEmail({}, { message: 'Invalid Email Message' })
  @IsEmpty({ message: 'Please Enter Your Email' })
  email: string;
  @IsEmpty({ message: 'Please Enter Your Phone' })
  phone: number;
}
