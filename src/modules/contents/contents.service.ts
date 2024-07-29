import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contents } from './contents.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Contents)
    private readonly repository: Repository<Contents>,
  ) {
  }

  getContentsList(params: any = {}) {
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
    return this.repository.query(sql);
  }

  countContentsList(params: any = {}) {
    const { title = '', author = '' } = params;
    let where = 'where 1=1';
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }
    const sql = `select count(*) as count from book ${where}`;
    return this.repository.query(sql);
  }

  deleteContents(fileName) {
    const deleteSql = `DELETE FROM contents WHERE fileName = '${fileName}'`;
    return this.repository.query(deleteSql);
  }

  addContents(params) {
    const { fileName, navId, href, order, level, text, label, pid, id } = params;
    const insertSql = `INSERT INTO contents(
        fileName,
        id,
        href,
        \`order\`,
        level,
        text,
        label,
        pid,
        navId
      ) VALUES(
        '${fileName}',
        '${id}',
        '${href}',
        '${order}',
        '${level}',
        '${text}',
        '${label}',
        '${pid}',
        '${navId}'
      )`;
    return this.repository.query(insertSql);
  }
}
