import { Controller, Get } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { Public, ResponseMessage } from 'src/decorator/customize';

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
  @Public()
  @Get('category')
  @ResponseMessage('Get Category Success!!')
  async getCategory() {
    const categories = [
      'Arts',
      'Business',
      'Comics',
      'Cooking',
      'Entertainment',
      'History',
      'Music',
      'Sports',
      'Teen',
      'Travel',
    ];

    const response = {
      data: categories,
    };

    return response;
  }
}
