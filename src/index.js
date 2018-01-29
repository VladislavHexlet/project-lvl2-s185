import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';


const parser = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseToAst = (oldFile, newFile) => {
  const oldFileKeys = Object.keys(oldFile);
  const newFileKeys = Object.keys(newFile);
  const unitedKeys = _.union(oldFileKeys, newFileKeys);
  return unitedKeys.map((key) => {
    if (newFile[key] === oldFile[key]) {
      if (!(newFile[key] instanceof Object)) {
        return {
          name: key, type: 'stay', value: newFile[key],
        };
      }
      return {
        name: key, type: 'stay', value: parseToAst(oldFile[key], newFile[key]),
      };
    } else if (!newFileKeys.includes(key)) {
      if (!(oldFile[key] instanceof Object)) {
        return {
          name: key, type: 'removed', value: oldFile[key],
        };
      }
      return {
        name: key, type: 'removed', value: parseToAst(oldFile[key], oldFile[key]),
      };
    } else if (!oldFileKeys.includes(key)) {
      if (!(newFile[key] instanceof Object)) {
        return {
          name: key, type: 'added', value: newFile[key],
        };
      }
      return {
        name: key, type: 'added', value: parseToAst(newFile[key], newFile[key]),
      };
    }
    if (newFile[key] instanceof Object) {
      return {
        name: key, type: 'stay', value: parseToAst(oldFile[key], newFile[key]),
      };
    }
    return {
      name: key, type: 'updated', previousValue: oldFile[key], newValue: newFile[key],
    };
  });
};

const createRootAst = (oldFile, newFile) => ({ value: parseToAst(oldFile, newFile) });

const render = (ast, repeatN = 1) => {
  const indentLength = '    '.repeat(repeatN);
  const indentLengthSigns = indentLength.slice(0, indentLength.length - 2);
  const result = ast.value.map((node) => {
    const content = _.isObject(node.value) ? `{\n${render(node, repeatN + 1)}\n${indentLength}}` : node.value;
    switch (node.type) {
      case 'stay':
        return `${indentLength}${node.name}: ${content}`;
      case 'added':
        return `${indentLengthSigns}+ ${node.name}: ${content}`;
      case 'removed':
        return `${indentLengthSigns}- ${node.name}: ${content}`;
      case 'updated':
        return `${indentLengthSigns}+ ${node.name}: ${node.newValue}\n${indentLengthSigns}- ${node.name}: ${node.previousValue}`;
      default:
        return 1;
    }
  });
  return result.join('\n');
};

const genDiff = (pathOldConfig, pathNewConfig) => {
  const oldFile = fs.readFileSync(pathOldConfig, 'utf-8');
  const newFile = fs.readFileSync(pathNewConfig, 'utf-8');
  const fileExt = path.extname(pathOldConfig);
  const parse = parser[fileExt];
  const oldConfigObj = parse(oldFile);
  const newConfigObj = parse(newFile);
  const ast = createRootAst(oldConfigObj, newConfigObj);
  const diff = render(ast);
  return `{\n${diff}\n}\n`;
};

export default genDiff;
