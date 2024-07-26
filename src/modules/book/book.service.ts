import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { wrapperResponse } from '../../utils';
import EpubBook from './epub-book';


@Injectable()
export class BookService {
  constructor(@InjectRepository(Book) private readonly bookRepository: Repository<Book>) {}

  getBookList(params,userid) {
    let page = +params.page || 1;
    let pageSize = +params.pageSize || 20;
    const { title = '', author = '' } = params;
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 20;
    }
    let where = 'where 1=1';
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }
    const sql = `select * from book ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.bookRepository.query(sql);
  }

  async countBookList(params: any = {}, userid) {
    const { title = '', author = '' } = params;
    let where = 'where 1=1';
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }
    // const categoryAuth = await this.getCategoryAuth(userid);
    // if (categoryAuth.length > 0) {
    //   where += ` AND categoryText IN (${categoryAuth.join(',')})`;
    // }
    const sql = `select count(*) as count from book ${where}`;
    return this.bookRepository.query(sql);
  }

  uploadBook(file) {
    console.log(file);
    // const destDir = '/opt/homebrew/var/www/upload';
    const destDir = '/实战video';
    const destPath = path.resolve(destDir, file.originalname);
    fs.writeFileSync(destPath, file.buffer);
    return this.parseBook(destPath, file).then((data) => {
      return {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: destPath,
        dir: destDir,
        data,
      };
    });
  }

  parseBook(bookPath, file) {
    const epub = new EpubBook(bookPath, file);
    return epub.parse();
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  
}
