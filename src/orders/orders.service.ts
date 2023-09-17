import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Book, BookDocument } from 'src/books/Schema/book.schema';
import aqp from 'api-query-params';

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
    // Kiểm tra bookName trong mảng detail
    // for (const orderDetail of detail) {
    //   const { bookName } = orderDetail;

    //   // Tìm sách với mainText tương ứng
    //   const book = await this.bookModel.findOne({ mainText: bookName });

    //   if (!book) {
    //     // Nếu không tìm thấy sách, bạn có thể xử lý lỗi hoặc báo cáo nó tùy theo yêu cầu của bạn.
    //     throw new BadRequestException(`Sách với mainText: ${bookName} không tồn tại`);
    //   }
    // }
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

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
