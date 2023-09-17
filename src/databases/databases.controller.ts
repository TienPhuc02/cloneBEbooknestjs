import { Controller, Get } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}
  @Get('dashboard')
  @ResponseMessage('Get DashBoard Success!!')
  async getDashboardData() {
    const orderCount = await this.databasesService.getOrderCount();
    const userCount = await this.databasesService.getUserCount();
    const responseData = {
      data: {
        countOrder: orderCount,
        countUser: userCount,
      },
    };
    return responseData;
  }
}
