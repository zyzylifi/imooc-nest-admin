import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as AdmZip from 'adm-zip';
import * as XmlJS from 'xml2js';
import { NGINX_PATH } from '../../utils/const';

export function unzip(bookPath, unzipPath) {
  const zip = new AdmZip(bookPath);
  zip.extractAllTo(unzipPath, true);
}

export function parseRootFile(unzipPath) {
  const containerFilePath = path.resolve(unzipPath, 'META-INF/container.xml');
  const containerXml = fs.readFileSync(containerFilePath, 'utf-8');
  // console.log(containerXml);
  const { parseStringPromise } = XmlJS;
  return parseStringPromise(containerXml, {
    explicitArray: false,
  }).then((data) => {
    // console.log(data, data.container.rootfiles);
    return data.container.rootfiles.rootfile['$']['full-path'];
  });
}

export function parseContentOpf(unzipPath, filePath, fileName) {
  // 获取content.opf路径
  const fullPath = path.resolve(unzipPath, filePath);
  const contentOpf = fs.readFileSync(fullPath, 'utf-8');
  // console.log(contentOpf);
  const { parseStringPromise } = XmlJS;
  return parseStringPromise(contentOpf, {
    explicitArray: false,
  }).then(async (data) => {
    // console.log(data);
    const { metadata } = data.package;
    // console.log(metadata);
    const title = metadata['dc:title']; // 书名
    const creator = metadata['dc:creator']; // 作者
    const language = metadata['dc:language']; // 语种
    const publisher = metadata['dc:publisher']; // 出版社
    const coverMeta = metadata.meta.find((meta) => meta['$'].name === 'cover');
    const coverId = coverMeta['$'].content;
    const manifest = data.package.manifest.item;
    const coverRes = manifest.find((m) => m['$'].id === coverId);
    const dir = path.dirname(fullPath);
    const cover = path.resolve(dir, coverRes['$'].href);
    console.log(`电子书信息:
    书名：${title}
    作者：${creator}
    语种：${language}
    出版社：${publisher}
    封面：${cover}
    `);
    const rootDir = path.dirname(filePath);
    const content = await parseContent(dir, 'toc.ncx', rootDir, fileName); // 解析目录
    // console.log(content);
    return {
      title,
      creator,
      author: creator,
      language,
      publisher,
      cover,
      content,
      rootFile: filePath,
    };
  });
}

export async function parseContent(
  contentDir,
  contentFilePath,
  rootDir,
  fileName,
) {
  const contentPath = path.resolve(contentDir, contentFilePath);
  const contentXml = fs.readFileSync(contentPath, 'utf-8');
  const { parseStringPromise } = XmlJS;
  const data = await parseStringPromise(contentXml, { explicitArray: false });
  const navMap = data.ncx.navMap.navPoint;
  const fileNameWithoutSuffix = fileName.replace('.epub', '');
  // console.log(navMap);
  const navData = navMap.map((nav) => {
    const id = nav['$'].id;
    const playOrder = +nav['$'].playOrder;
    const text = nav.navLabel.text;
    const href = nav.content['$'].src;
    return {
      id,
      playOrder,
      text,
      href: `${fileNameWithoutSuffix}/${rootDir}/${href}`,
    };
  });
  return navData;
}

export function copyCoverImage(data, tmpDir) {
  const { cover } = data;
  if (!cover) {
    return;
  }
  console.log(cover)
  const coverPathname = cover.replace(tmpDir + '\\', '');
  const coverDir = path.resolve(NGINX_PATH, 'cover');
  console.log(coverPathname, coverDir)
  const coverNewPath = path.resolve(coverDir, coverPathname);
  console.log(cover,coverNewPath)
  fse.mkdirpSync(coverDir);
  fse.copySync(cover, coverNewPath);
  return coverPathname;
}

export function copyUnzipBook(tmpDir, dirName) {
  const bookDir = path.resolve(NGINX_PATH, 'book', dirName);
  fse.mkdirpSync(bookDir);
  fse.copySync(tmpDir, bookDir);
}
