import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/Schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/Schema/role.schema';

import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_BOOK, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { User, UserDocument } from 'src/users/Schema/user.schema';
import { Order, OrderDocument } from 'src/orders/Schema/order.schema';
import { Book, BookDocument } from 'src/books/Schema/book.schema';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});
      const countBook = await this.bookModel.count({});

      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        //bulk create
      }
      if (countBook === 0) {
        await this.bookModel.insertMany(INIT_BOOK);
        //bulk create
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin thì full quyền :v',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng/Ứng viên sử dụng hệ thống',
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            fullName: "I'm admin",
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            phone: 123456789,
            role: adminRole?._id,
            avatar:
              'c21f969b5f03d33d43e04f8f136e7682.png',
          },
          {
            name: 'Đỗ Tiến Phúc',
            email: 'dotienphuc@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 96,
            gender: 'MALE',
            address: 'VietNam',
            role: adminRole?._id,
            avatar:
              'c21f969b5f03d33d43e04f8f136e7682.png',
          },
          {
            name: "I'm normal user",
            email: 'user@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 69,
            gender: 'MALE',
            address: 'VietNam',
            role: userRole?._id,
            avatar:
              'c21f969b5f03d33d43e04f8f136e7682.png',
          },
        ]);
      }

      if (
        countUser > 0 &&
        countRole > 0 &&
        countPermission > 0 &&
        countBook > 0
      ) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
      }
    }
  }
  async getOrderCount(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }

  async getUserCount(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
