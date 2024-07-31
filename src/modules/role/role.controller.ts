import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { wrapperResponse } from '../../utils';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRole(@Query() query) {
    return wrapperResponse(
      this.roleService.findAll(query),
      '获取角色列表成功',
    );
  }

  @Put()
  update(@Body() body) {
    return wrapperResponse(
      this.roleService.update(body),
      '编辑角色成功',
    );
  }

  @Post()
  create(@Body() body) {
    return wrapperResponse(
      this.roleService.create(body),
      '新增角色成功',
    );
  }

  @Get('role_menu')
  getRoleMenu(@Query('roleId') roleId: string | number) {
    return wrapperResponse(
      this.roleService.getRoleMenu(roleId),
      '获取角色和菜单绑定关系成功',
    );
  }

  @Post('role_menu')
  createRoleMenu(@Body() body) {
    return wrapperResponse(
      this.roleService.createRoleMenu(body),
      '新增角色和菜单绑定关系成功',
    );
  }

  @Delete('role_menu')
  removeRoleMenu(@Body() body) {
    return wrapperResponse(
      this.roleService.removeRoleMenu(body.roleId),
      '删除角色和菜单绑定关系成功',
    );
  }

  @Get('auth')
  getAuthList(@Query() query) {
    return wrapperResponse(
      this.roleService.getAuthList(query),
      '获取权限数据成功',
    );
  }

  @Post('auth')
  createAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.createAuth(body),
      '新增权限成功',
    );
  }

  @Put('auth')
  updateAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.updateAuth(body),
      '编辑权限成功',
    );
  }

  @Post('role_auth')
  createRoleAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.createRoleAuth(body),
      '新增角色和权限绑定关系成功',
    );
  }

  @Delete('role_auth')
  removeRoleAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.removeRoleAuth(body),
      '删除角色和权限绑定关系成功',
    );
  }

  @Delete('auth')
  removeAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.removeAuth(body.id),
      '删除权限成功',
    );
  }

  @Get('role_auth')
  getRoleAuth(@Query('roleId') roleId: string | number) {
    return wrapperResponse(
      this.roleService.getRoleAuth(roleId),
      '获取角色和权限绑定关系成功',
    );
  }

  @Get('role_auth/get_auth_by_role')
  getRoleAuthByRoleName(@Query('roleName') roleName: string | number) {
    return wrapperResponse(
      this.roleService.getRoleAuthByRoleName(roleName),
      '获取角色和权限绑定关系成功',
    );
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.roleService.remove(id);
  // }

  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }
}
