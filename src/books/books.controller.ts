import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/')
  @ResponseMessage('Create A New Book Success !!')
  async create(@Body() createBookDto: CreateBookDto, @User() user: IUser) {
    const newBook = await this.booksService.create(createBookDto, user);
    return {
      newBook,
      _id: newBook._id,
      createdAt: newBook.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Get A Book With Paginate Success !!')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.booksService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get A Book With Id Success !!')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Update A New Book Success !!')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser,
  ) {
    const newBook = await this.booksService.update(id, updateBookDto, user);
    return newBook;
  }

  @Delete(':id')
  @ResponseMessage('Delete A Book Success !!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.booksService.remove(id, user);
  }
}
