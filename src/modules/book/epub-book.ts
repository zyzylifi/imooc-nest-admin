import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';
import { unzip, parseRootFile, parseContentOpf, copyCoverImage, copyUnzipBook } from './epub-parse';
import { Logger } from '@nestjs/common';
import { NGINX_PATH } from '../../utils/const';
const TEMP_PATH = '.vben/tmp-book';


class EpubBook {
  private bookPath: string;
  private file: string;
  private fileName: string;
  private size: number;

  constructor(bookPath, file) {
    this.bookPath = bookPath;
    this.file = file;
    this.fileName = file.originalname;
    this.size = file.size;
  }

  async parse() {
    console.log('电子书解析', this.bookPath, this.file);
    // 1.生成临时文件
    const homeDir = os.homedir();
    const tmpDir = path.resolve(homeDir, TEMP_PATH);
    const tmpFile = path.resolve(tmpDir, this.fileName);
    fse.copySync(this.bookPath, tmpFile);
    // 2.epub电子书解压
    const tmpUnzipDirName = this.fileName.replace('.epub', '');
    const tmpUnzipDir = path.resolve(tmpDir, tmpUnzipDirName);
    fse.mkdirpSync(tmpUnzipDir);
    unzip(this.bookPath, tmpUnzipDir);
    // 3.epub root file解析
    const rootFile = await parseRootFile(tmpUnzipDir);
    console.log(rootFile);
    // 4.epub content opf解析
    const bookData = await parseContentOpf(
      tmpUnzipDir,
      rootFile,
      this.fileName,
    );
    console.log(bookData,'bookData')
    // 5.拷贝电子书封面图片
    // const cover = copyCoverImage(bookData, tmpDir);
    // bookData.cover = cover;
    // 6.拷贝解压后电子书
    const bookDir = path.resolve(NGINX_PATH, 'book', );
    console.log(tmpDir)
    const coverPathname = bookData.cover.replace(tmpDir + '/', '');
    copyUnzipBook(tmpUnzipDir, tmpUnzipDirName);
    bookData.cover = bookDir+'/'+coverPathname;
    console.log(bookData.cover);
    // 7.删除临时文件
    fse.removeSync(tmpFile);
    fse.removeSync(tmpUnzipDir);
    return bookData;
  }
}

export default EpubBook;
