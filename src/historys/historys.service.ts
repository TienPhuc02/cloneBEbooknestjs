import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/orders/Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class HistorysService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
  ) {}
  create(createHistoryDto: CreateHistoryDto) {
    return 'This action adds a new history';
  }

  async getAllHistory(user: IUser) {
    const { fullName } = user;
    // Truy vấn tất cả các đơn hàng và lấy danh sách đơn hàng
    return this.orderModel.find({ name: fullName }).exec();
  }
  findAll() {
    return `This action returns all historys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
