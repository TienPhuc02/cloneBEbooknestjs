import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly multerConfigService: MulterConfigService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileImageBook'))
  @ResponseMessage('Upload File Success !!')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(jpg|jpeg|png|image\/png|image\/jpeg|gif|image\/gif|txt|pdf|application\/pdf|doc|application\/msword|docx|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|text\/plain)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1000, //kb =1mb
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    // Lưu thông tin tệp vào MongoDB
    const fileData = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const savedFile = await this.filesService.createFile(fileData);

    return {
      file: savedFile,
    };
  }

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }
}
