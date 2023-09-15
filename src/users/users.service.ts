import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from './Schema/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto) {
    const { fullName, email, password, phone, role } = createUserDto;
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      fullName,
      email,
      role: 'USER',
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
  async register(user: RegisterUserDto) {
    const { fullName, email, password, phone } = user;
    const hashPassword = this.getHashPassword(password);
    const newRegister = await this.userModel.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
      phone: phone,
    });
    return newRegister;
  }
  updateUserToken = async (refresh_token: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id: _id },
      {
        refreshToken: refresh_token,
      },
    );
  };
  
}
