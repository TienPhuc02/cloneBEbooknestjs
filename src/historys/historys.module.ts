import { Module } from '@nestjs/common';
import { HistorysService } from './historys.service';
import { HistorysController } from './historys.controller';

import { User, UserSchema } from 'src/users/Schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/orders/Schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [HistorysController],
  providers: [HistorysService],
})
export class HistorysModule {}
