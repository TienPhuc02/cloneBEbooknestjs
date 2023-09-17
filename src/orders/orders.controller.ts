import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Created A  New Order Success!!')
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    const newOrder = await this.ordersService.create(createOrderDto, user);
    return newOrder;
  }

  @Get()
  @ResponseMessage('Get A   Order With Paginate Success!!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.ordersService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get A   Order With Id Success!!')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update A   Order With Id Success!!')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete A   Order With Id Success!!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ordersService.remove(id, user);
  }
}
