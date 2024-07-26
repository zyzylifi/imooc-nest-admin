import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request,UploadedFile, UseInterceptors, ParseFilePipeBuilder } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { wrapperCountResponse,wrapperResponse } from '../../utils';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBookList(@Query() params, @Request() request) {
    const { user: { userid } } = request;
    return wrapperCountResponse(
      this.bookService.getBookList(params, userid),
      this.bookService.countBookList(params, userid),
      '获取图书列表成功',
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder().addFileTypeValidator({
      fileType: 'epub',
    }).build(),
  ) file: Express.Multer.File) {
    return wrapperResponse(
      this.bookService.uploadBook(file),
      '上传文件成功',
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookService.findOne(+id);
  // }

  
}
