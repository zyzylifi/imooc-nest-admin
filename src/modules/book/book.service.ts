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

  getBook(id) {
    const sql = `SELECT * FROM book WHERE id="${id}"`;
    return this.bookRepository.query(sql);
  }

  parseBook(bookPath, file) {
    const epub = new EpubBook(bookPath, file);
    return epub.parse();
  }

  addBook(params) {
    const { title, author, fileName, category, categoryText, cover, language, publisher, rootFile } = params;
    const insertSql = `INSERT INTO book(
        fileName,
        cover,
        title,
        author,
        publisher,
        bookId,
        category,
        categoryText,
        language,
        rootFile
      ) VALUES(
        '${fileName}',
        '${cover}',
        '${title}',
        '${author}',
        '${publisher}',
        '${fileName}',
        '${category}',
        '${categoryText}',
        '${language}',
        '${rootFile}'
      )`;
    return this.bookRepository.query(insertSql);
    
  }

  async updateBook(params) {
    const { id, title, author, category, categoryText, language, publisher } = params;
    const setSql = [];
    if (title) {
      setSql.push(`title="${title}"`);
    }
    if (author) {
      setSql.push(`author="${author}"`);
    }
    const updateSql = `UPDATE book SET ${setSql.join(',')} WHERE id=${id}`;
    return this.bookRepository.query(updateSql);
  }

  deleteBook(id: number) {
    const sql = `DELETE FROM book WHERE id = ${id}`;
    return this.bookRepository.query(sql);
  }

  
}
