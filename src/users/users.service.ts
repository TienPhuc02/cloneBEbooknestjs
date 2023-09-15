import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from './Schema/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Request } from 'express';

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
  async create(createUserDto: CreateUserDto, user: IUser) {
    const { fullName, email, password, phone } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email : ${email} đã tồn tại trên hệ thống vui lòng sử dụng Email khác`,
      );
    }
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      fullName,
      email,
      role: 'USER',
      password: hashPassword,
      phone,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }
  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.userModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    const result = await this.userModel
      .find(filter)
      // tìm theo điều kiện
      .skip(offset)
      // bỏ qua bao nhiêu phần tử
      .limit(defaultLimit)
      // bao nhiêu phần tử 1 trang
      .select('-password')
      .sort(filter.sort)
      .populate(population)
      .exec();
    //chọc xuống database nên sẽ là hàm promise async await
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
      // không cần phải truyền giá trị currentPage vào hàm findAll vì nó được tính toán trong hàm dựa trên offset và defaultLimit.
    };
  }
  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    const getUser = this.userModel.findOne({ _id: id });
    return getUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
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

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }
  async register(user: RegisterUserDto) {
    const { fullName, email, password, phone } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email : ${email} đã tồn tại trên hệ thống vui lòng sử dụng Email khác`,
      );
    }
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
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return `not found user`;
    }
    return await this.userModel.updateOne(
      { _id: _id },
      {
        refreshToken: refresh_token,
      },
    );
  };
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({
      refreshToken,
    });
  };
  async createListUser(userList: CreateUserDto[], user: IUser) {
    if (!Array.isArray(userList)) {
      // Xử lý khi userList không phải là mảng
      return 'userList is not an array';
    }
    const hashPasswordPromises = userList.map(async (userDto) => {
      const { fullName, email, password, phone } = userDto;
      const hashPassword = this.getHashPassword(password);
      const newUser = {
        fullName,
        email,
        role: 'USER',
        password: hashPassword,
        phone,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      };
      return newUser;
    });

    const hashedUsers = await Promise.all(hashPasswordPromises);

    const newListUser = await this.userModel.insertMany(hashedUsers);

    return {
      newListUser,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    };
  }
}
