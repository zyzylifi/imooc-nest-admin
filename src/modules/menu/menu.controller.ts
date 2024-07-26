import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { wrapperResponse } from '../../utils';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return wrapperResponse(
      this.menuService.create(createMenuDto.data),
      '创建菜单成功',
    );
  }

  @Put()
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return wrapperResponse(
      this.menuService.update(updateMenuDto.data?.id, updateMenuDto),
      '更新菜单成功',
    );
  }

  @Get('active')
  getActiveMenu() {
    return wrapperResponse(
      this.menuService.findActive(),
      '获取菜单成功',
    );
  }

  @Get('getMenuList')
  getMenuList(@Query() updateMenuDto: UpdateMenuDto) {
    return wrapperResponse(
      this.menuService.findMenuList(updateMenuDto.name, updateMenuDto.active),
      '获取菜单成功',
    );
  }

  @Get()
  getAllMenu() {
    return wrapperResponse(
      this.menuService.findAll(),
      '获取菜单成功',
    );
  }

}
