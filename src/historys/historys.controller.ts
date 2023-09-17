import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorysService } from './historys.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('historys')
export class HistorysController {
  constructor(private readonly historysService: HistorysService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historysService.create(createHistoryDto);
  }
  @Get()
  @ResponseMessage("Get All History order Success!!")
  getAllHistory(@User() user:IUser) {
    return this.historysService.getAllHistory(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historysService.update(+id, updateHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historysService.remove(+id);
  }
}
