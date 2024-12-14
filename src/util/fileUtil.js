import fs from 'fs/promises';
import path from 'path';

const PRODUCT_SEPARATOR = ',';
const NEW_LINE = '\n';

export async function parseFileContent(fileName) {
  const filePath = path.join(process.cwd(), 'public', fileName);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const products = parseFileData(data);
    return products;
  } catch {
    throw new Error('파일을 읽는 중 에러 발생');
  }
}

function parseFileData(data) {
  const lines = data.trim().split(NEW_LINE);
  const headers = lines[0].split(PRODUCT_SEPARATOR);
  return lines.slice(1).map((line) => {
    const values = line.split(PRODUCT_SEPARATOR);
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });
}
