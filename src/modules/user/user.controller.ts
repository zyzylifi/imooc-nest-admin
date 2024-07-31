import { Controller, Get, Post, Body, Patch, Param, Delete,Req, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { wrapperResponse } from '../../utils';
import { query } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  findUserByToken(@Req() req) {
    return wrapperResponse(this.userService.findByUsername(req.user.username), '获取用户信息成功');
  }

  @Get()
  findAllUser(@Query() query) {
    return wrapperResponse(this.userService.getUserList(query),'获取用户列表成功')
  }

  @Put()
  updateUser(@Body() body) {
    return wrapperResponse(
      this.userService.update(body),
      '编辑用户成功',
    );
  }

  @Post()
  create(@Body() body) {
    return wrapperResponse(
      this.userService.createUser(body),
      '新增用户成功',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete()
  remove(@Body() body) {
    return wrapperResponse(
      this.userService.remove(+body.id),
      '删除用户成功',
    )
  }
}
