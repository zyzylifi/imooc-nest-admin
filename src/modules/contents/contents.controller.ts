import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentsService } from './contents.service';
import { wrapperCountResponse, wrapperResponse } from '../../utils';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  getContentsList(@Query() params) {
    return wrapperResponse(
      null,
      '获取目录列表成功',
    );
  }

  @Post()
  insertContents(@Body() body) {
    return wrapperResponse(
      this.contentsService.addContents(body),
      '新增目录成功',
    );
  }

  @Delete()
  deleteContents(@Body() body) {
    console.log(body);
    return wrapperResponse(
      this.contentsService.deleteContents(body.fileName),
      '删除电子书目录成功',
    );
  }
}
