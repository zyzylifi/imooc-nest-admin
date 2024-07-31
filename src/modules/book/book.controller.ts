import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request,UploadedFile, UseInterceptors, ParseFilePipeBuilder, ParseIntPipe,Put } from '@nestjs/common';
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

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id) {
    return wrapperResponse(
      this.bookService.getBook(id),
      '查询电子书成功',
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder().addFileTypeValidator({
      fileType: '/epub/',
    }).build(),
  ) file: Express.Multer.File) {
    return wrapperResponse(
      this.bookService.uploadBook(file),
      '上传文件成功',
    );
  }

  @Post()
  insertBook(@Body() body) {
    return wrapperResponse(
      this.bookService.addBook(body),
      '新增电子书成功',
    )
  }

  @Put()
  updateBook(@Body() body) {
    return wrapperResponse(
      this.bookService.updateBook(body),
      '更新电子书成功',
    );
  }

  @Delete()
  deleteBook(@Body() id) {
    return wrapperResponse(
      this.bookService.deleteBook(+id.id),
      '删除电子书成功',
    )
  }

  
}
