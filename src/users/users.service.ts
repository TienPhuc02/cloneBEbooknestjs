import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './Schema/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

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
  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }
  
  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }
  async findOne(id: string) {
    const getUser = this.userModel.findOne({ _id: id });
    return getUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { fullName, email, phone } = updateUserDto;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      {
        fullName: fullName,
        email: email,
        phone: phone,
      },
    );
    return updateUser;
  }

  remove(id: string) {
    const deletedUser = this.userModel.deleteOne({ _id: id });
    return deletedUser;
  }
}
