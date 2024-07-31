import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  createUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.nickname = createUserDto.nickname || createUserDto.username;
    user.role = createUserDto.role;
    user.avatar = createUserDto.avatar;
    user.active = 1;
    return this.userRepository.save(user);
  }

  getUserList(params) {
    let page = +params.page || 1;
    let pageSize = +params.pageSize || 20;
    const { id = '', username = '',active = 1 } = params;
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 20;
    }
    let where = 'where 1=1';
    if (id) {
      where += ` AND id='${id}'`;
    }
    if (username) {
      where += ` AND username LIKE '%${username}%'`;
    }
    if (active) {
      where += ` AND active='${active}'`;
    }
    const sql = `select * from admin_user ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.userRepository.query(sql);
  }

  update(params) {
    // console.log(params);
    const { username, nickname, active, role } = params;
    const setSql = [];
    if (nickname) {
      setSql.push(`nickname="${nickname}"`);
    }
    if (active) {
      setSql.push(`active="${active}"`);
    }
    if (role) {
      setSql.push(`role=${JSON.stringify(role)}`);
    }
    const updateSql = `UPDATE admin_user SET ${setSql.join(',')} WHERE username="${username}"`;
    return this.userRepository.query(updateSql);
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    const sql = `DELETE FROM admin_user WHERE id = ${id}`;
    return this.userRepository.query(sql);
  }
  
  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
