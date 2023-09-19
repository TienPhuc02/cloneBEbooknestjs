import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Book, BookDocument } from 'src/books/Schema/book.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Book.name) private bookModel: SoftDeleteModel<BookDocument>,
  ) {}
  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { name, phone, totalPrice, detail } = createOrderDto;
    const orderDetails = detail.map((item) => {
      return {
        bookName: item.bookName,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const newOrder = await this.orderModel.create({
      name,
      phone,
      totalPrice,
      detail: orderDetails,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newOrder;
  }

  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.orderModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    if (sort as  any ==="-price" ) {
      // @ts-ignore: Unreachable code error
      sort = '-price';
    }
    if (sort as  any ==="-name" ) {
      //@ts-ignore: Unreachable code error
      sort = '-name';
    }
    if (sort as  any ==="-address" ) {
      // @ts-ignore: Unreachable code error
      sort = '-address';
    }
    if (sort as  any ==="-phone" ) {
      // @ts-ignore: Unreachable code error
      sort = '-phone';
    }
    if (sort as  any ==="-updatedAt" ) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }
    const result = await this.orderModel
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
    return await this.orderModel.find({ _id: id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    const { name, phone, totalPrice, detail } = updateOrderDto;
    const orderDetails = detail?.map((item) => {
      return {
        bookName: item.bookName,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const newOrder = await this.orderModel.updateOne(
      { _id: id },
      {
        name,
        phone,
        totalPrice,
        detail: orderDetails,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return newOrder;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.orderModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.orderModel.softDelete({ _id: id });
  }
}
