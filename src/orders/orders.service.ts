import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Book, BookDocument } from 'src/books/Schema/book.schema';

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

  findAll() {
    return `This action returns all orders`;
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
