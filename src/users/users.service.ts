import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schema/user.schema';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto) {
    const { fullName, email, password, phone } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      fullName,
      email,
      password: hashPassword,
      phone,
    });
    return newUser;
  }
  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const getUser = this.userModel.findOne({ _id: id });
    return getUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
