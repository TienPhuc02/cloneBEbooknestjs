import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './Schema/permission.schema';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  @InjectModel(Permission.name)
  private permissionModel: SoftDeleteModel<PermissionDocument>;
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExistApiPath = await this.permissionModel.findOne({ apiPath });
    if (isExistApiPath) {
      throw new BadRequestException(
        `apiPath : ${apiPath} đã tồn tại trên hệ thống vui lòng sử dụng apiPath khác`,
      );
    }
    const isExistMethod = await this.permissionModel.findOne({ method });
    if (isExistMethod) {
      throw new BadRequestException(
        `method : ${method} đã tồn tại trên hệ thống vui lòng sử dụng method khác`,
      );
    }
    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt,
    };
  }
  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.permissionModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    const result = await this.permissionModel
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

  async findOne(id: string) {
    return await this.permissionModel.find({ _id: id });
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    const { name, apiPath, method, module } = updatePermissionDto;
    const newPermission = this.permissionModel.updateOne(
      { _id: id },
      {
        name,
        apiPath,
        method,
        module,
        upatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return newPermission;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.permissionModel.softDelete({ _id: id });
  }
}
