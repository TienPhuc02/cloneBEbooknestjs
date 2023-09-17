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
import { Role, RoleDocument } from 'src/roles/Schema/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
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
    const { filter, sort, population, projection } = aqp(qs);
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
      .select(projection as any)
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
    return this.userModel
      .findOne({ email: username })
      .populate({ path: 'role', select: { name: 1 } });
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    return (
      await this.userModel.findOne({ _id: id }).select('-password')
    ).populate({
      path: 'role',
      select: {
        name: 1,
        _id: 1,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
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
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updateUser;
  }
  async updateInfo(id: string, updateUserDto: UpdateUserDto, user: IUser) {
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
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updateUser;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    const foundUser = await this.userModel.findById(id);
    console.log(
      '🚀 ~ file: users.service.ts:130 ~ UsersService ~ remove ~ foundUser:',
      foundUser,
    );
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('không thể xóa tài khoản admin');
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
    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hashPassword = this.getHashPassword(password);
    const newRegister = await this.userModel.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
      phone: phone,
      role: userRole?._id,
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
    return await this.userModel
      .findOne({
        refreshToken,
      })
      .populate({ path: 'role', select: { name: 1 } });
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
  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!this.isValidPassword(oldPassword, user.password)) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashPassword = this.getHashPassword(newPassword);

    await this.userModel.updateOne(
      { _id: user._id },
      { password: hashPassword },
    );

    return 'Mật khẩu đã được thay đổi thành công';
  }
}
