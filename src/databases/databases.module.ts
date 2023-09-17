import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';


import {
  Permission,
  PermissionSchema,
} from 'src/permissions/Schema/permission.schema';
import { Role, RoleSchema } from 'src/roles/Schema/role.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/Schema/user.schema';
import { Order, OrderSchema } from 'src/orders/Schema/order.schema';
import { Book, BookSchema } from 'src/books/Schema/book.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Book.name, schema:BookSchema},
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
})
export class DatabasesModule {}
