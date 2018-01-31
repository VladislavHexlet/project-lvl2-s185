import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getRender from './renderers';
import getAst from './ast';

const genDiff = (pathOldConfig, pathNewConfig, type = 'standart') => {
  const oldFile = fs.readFileSync(pathOldConfig, 'utf-8');
  const newFile = fs.readFileSync(pathNewConfig, 'utf-8');
  const fileExt = path.extname(pathOldConfig);
  const parse = getParser(fileExt);
  const oldConfigObj = parse(oldFile);
  const newConfigObj = parse(newFile);
  const ast = getAst(oldConfigObj, newConfigObj);
  const render = getRender(type);
  const diff = render(ast);
  return diff;
};

export default genDiff;
