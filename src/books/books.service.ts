import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './Schema/book.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: SoftDeleteModel<BookDocument>,
  ) {}
  async create(createBookDto: CreateBookDto, user: IUser) {
    const {
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
    } = createBookDto;
    const isExist = await this.bookModel.findOne({ mainText });
    if (isExist) {
      throw new BadRequestException(
        `mainText : ${mainText} đã tồn tại trên hệ thống vui lòng sử dụng mainText khác`,
      );
    }
    const newBook = this.bookModel.create({
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newBook;
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
