import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { File, FileDocument } from './Schema/file.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: SoftDeleteModel<FileDocument>,
  ) {}
  async create(createFileDto: CreateFileDto) {
    return 'abc';
  }

  findAll() {
    return `This action returns all files`;
  }
  createFile = async (fileData: any) => {
    const createdFile = await this.fileModel.create(fileData);
    return createdFile;
  };
  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
