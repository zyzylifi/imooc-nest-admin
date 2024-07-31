import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOneBy({ id });
  }

  findAll(query: any): Promise<Role[]> {
    const sql = `SELECT id, name, remark FROM role`;
    return this.roleRepository.query(sql);
  }

  create(params) {
    const role = new Role();
    role.name = params.name;
    role.remark = params.remark;
    return this.roleRepository.save(role);
  }

  update(params) {
    const { name, remark, id } = params;
    const setSql = [];
    if (name || remark) {
      name && setSql.push(`name="${name}"`);
      remark && setSql.push(`remark="${remark}"`);
      const updateSql = `UPDATE role SET ${setSql.join(',')} WHERE id="${id}"`;
      return this.roleRepository.query(updateSql);
    } else {
      return Promise.resolve({});
    }
  }

  remove(id: number): Promise<DeleteResult> {
    return this.roleRepository.delete(id);
  }

  findByUsername(username: string) {
    // return this.roleRepository.findOneBy();
  }

  async createRoleMenu(params) {
    const { roleId, menuId } = params;
    const insertSql = `INSERT INTO role_menu(
        roleId,
        menuId
      ) VALUES(
        '${roleId}',
        '${menuId}'
      )`;
    // 建立 roleId 和 menuId 的绑定关系
    const ret = await this.roleRepository.query(insertSql);
    // 查询 menu 信息
    const menuList = await this.roleRepository.query(`
      SELECT * FROM menu WHERE id='${menuId}'
    `);
    const roleList = await this.roleRepository.query(`
      SELECT * FROM role WHERE id='${roleId}'
    `);
    const [menu] = menuList || [];
    const [role] = roleList || [];
    if (menu && role) {
      let { meta } = menu;
      meta = JSON.parse(meta) || {};
      let flag = true;
      if (meta.roles && meta.roles.length > 0) {
        if (!meta.roles.includes(role.name)) {
          const roles = JSON.parse(meta.roles);
          roles.push(role.name);
          meta.roles = JSON.stringify(roles);
          flag = false;
        }
      } else {
        meta.roles = JSON.stringify([role.name]);
      }
      if (flag) {
        meta.roles = meta.roles.replaceAll('"', '\\"');
        meta = JSON.stringify(meta);
        // 保存新的meta信息
        await this.roleRepository.query(`
        UPDATE menu SET meta='${meta}' WHERE id='${menuId}'
      `);
      }
    }
    return ret;
  }

  removeRoleMenu(roleId) {
    if (roleId) {
      const sql = `DELETE FROM role_menu WHERE roleId='${roleId}'`;
      return this.roleRepository.query(sql);
    } else {
      return Promise.resolve({});
    }
  }

  getRoleMenu(roleId) {
    const sql = `SELECT roleId, menuId FROM role_menu WHERE roleId=${roleId}`;
    return this.roleRepository.query(sql);
  }

  getAuthList(query) {
    const { key } = query;
    let where = '1=1';
    if (key) {
      where += ` AND \`key\` LIKE "%${key}%"`;
    }
    const sql = `SELECT * FROM auth WHERE ${where}`;
    return this.roleRepository.query(sql);
  }

  createAuth(params) {
    const { key = '', name = '', remark = '' } = params;
    const insertSql = `INSERT INTO auth(
        \`key\`,
        name,
        remark
      ) VALUES(
        '${key}',
        '${name}',
        '${remark}'
      )`;
    return this.roleRepository.query(insertSql);
  }

  updateAuth(params) {
    const { name, remark, id } = params;
    const setSql = [];
    if (name || remark) {
      name && setSql.push(`name="${name}"`);
      remark && setSql.push(`remark="${remark}"`);
      const updateSql = `UPDATE auth SET ${setSql.join(',')} WHERE id="${id}"`;
      return this.roleRepository.query(updateSql);
    } else {
      return Promise.resolve({});
    }
  }

  async createRoleAuth(params) {
    const { roleId, authId } = params;
    const insertSql = `INSERT INTO role_auth(
        roleId,
        authId
      ) VALUES(
        '${roleId}',
        '${authId}'
      )`;
    // 建立 roleId 和 authId 的绑定关系
    return await this.roleRepository.query(insertSql);
  }

  removeRoleAuth(body) {
    if (body.roleId) {
      const sql = `DELETE FROM role_auth WHERE roleId='${body.roleId}'`;
      return this.roleRepository.query(sql);
    } else if (body.authId) {
      const sql = `DELETE FROM role_auth WHERE authId='${body.authId}'`;
      return this.roleRepository.query(sql);
    } else {
      return Promise.resolve({});
    }
  }

  getRoleAuth(roleId) {
    const sql = `SELECT roleId, authId FROM role_auth WHERE roleId=${roleId}`;
    return this.roleRepository.query(sql);
  }

  async getRoleAuthByRoleName(roleName) {
    roleName = JSON.parse(roleName);
    roleName = roleName.map((role) => `"${role}"`);
    const where = `WHERE 1=1 AND name IN (${roleName.join(',')})`;
    const sql = `SELECT id, name FROM role ${where}`;
    const roleList = await this.roleRepository.query(sql);
    const roleIds = roleList.map((role) => role.id);
    const authWhere = `WHERE 1=1 AND roleId IN (${roleIds.join(',')})`;
    const authSql = `SELECT roleId, authId FROM role_auth ${authWhere}`;
    const authList = await this.roleRepository.query(authSql);
    let authIds = authList.map((auth) => auth.authId);
    const authSet = new Set();
    authIds.forEach((id) => authSet.add(id));
    authIds = Array.from(authSet);
    if (authIds.length === 0) {
      return authIds;
    } else {
      const authInfo = await this.roleRepository.query(`
      SELECT * FROM auth WHERE id IN (${authIds.join(',')})
    `);
      return authInfo;
    }
  }

  removeAuth(authId) {
    if (authId) {
      const sql = `DELETE FROM auth WHERE id='${authId}'`;
      return this.roleRepository.query(sql);
    } else {
      return Promise.resolve({});
    }
  }
}
