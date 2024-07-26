import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ){}

  create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.save(createMenuDto);
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return this.menuRepository.update(id, updateMenuDto.data);
  }

  findAll() {
    const sql = 'select * from menu order by id asc';
    return this.menuRepository.query(sql);
  }

  findActive() {
    const sql = 'select * from menu where active = 1 order by id asc';
    return this.menuRepository.query(sql);
  }

  findMenuList(name:string,active:number) {
    let sql = `select * from menu order by id asc`;
    if(name){
      sql = `select * from menu where name like '%${name}%' order by id asc`;
    }
    if(active){
      sql = `select * from menu where active = ${active} order by id asc`;
    }
    return this.menuRepository.query(sql);
  }

}
