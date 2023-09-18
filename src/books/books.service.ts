import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './Schema/book.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { isEmpty } from 'class-validator';

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

  async findAll(current: string, pageSize: string, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize; // bỏ qua current và pageSize để lấy full item trước đã rồi lọc
    const offset: number = (+current - 1) * +pageSize; // bỏ qua bao nhiêu phần tử
    const defaultLimit: number = +pageSize ? +pageSize : 10; //lấy ra số phần tử trong 1 trang
    const totalItems = (await this.bookModel.find(filter)).length; // lấy ra tổng số lượng của tất cả các phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); //lấy ra tổng số trang
    if (sort as  any ==="-price" ) {
      // @ts-ignore: Unreachable code error
      sort = '-price';
    }
    if (sort as  any ==="-sold" ) {
      // @ts-ignore: Unreachable code error
      sort = '-sold';
    }
    if (sort as  any ==="-updatedAt" ) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }
    const result = await this.bookModel
      .find(filter)
      // tìm theo điều kiện
      .skip(offset)
      // bỏ qua bao nhiêu phần tử
      .limit(defaultLimit)
      // bao nhiêu phần tử 1 trang
      .select('-password')
      .sort(sort as any)
      .populate(population)
      .exec();
    //chọc xuống database nên sẽ là hàm promise async await
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
      // không cần phải truyền giá trị currentPage vào hàm findAll vì nó được tính toán trong hàm dựa trên offset và defaultLimit.
    };
  }

  async findOne(id: string) {
    return await this.bookModel.find({ _id: id });
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: IUser) {
    const {
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
    } = updateBookDto;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found book`;
    }
    const newBookUpdate = this.bookModel.updateOne(
      { _id: id },
      {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        sold,
        quantity,
        category,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return newBookUpdate;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.bookModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.bookModel.softDelete({ _id: id });
  }
}
