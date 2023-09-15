import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get A Book With Id Success !!')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('UPdate A New Book Success !!')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete A Book Success !!')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
