import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';

const valueToString = (value, indentLength) => {
  if (!_.isObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.map(key => `${indentLength}    ${key}: ${valueToString(value[key], indentLength + 1)}`);
  return `{\n${result.join('\n')}\n${indentLength}}`;
};

const parser = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const createAst = (oldFile, newFile) => {
  const oldFileKeys = Object.keys(oldFile);
  const newFileKeys = Object.keys(newFile);
  const unitedKeys = _.union(oldFileKeys, newFileKeys);
  return unitedKeys.map((key) => {
    if ((oldFile[key] instanceof Object && newFile[key] instanceof Object) &&
    !(oldFile[key] instanceof Array && newFile[key] instanceof Array) &&
    !_.isEqual(oldFile[key], newFile[key])) {
      return {
        name: key,
        type: 'complex',
        children: createAst(oldFile[key], newFile[key]),
        value: { previousValue: '', newValue: '' },
      };
    } else if (!_.has(newFile, key)) {
      return {
        name: key,
        type: 'removed',
        children: [],
        value: { previousValue: oldFile[key], newValue: '' },
      };
    } else if (!_.has(oldFile, key)) {
      return {
        name: key,
        type: 'added',
        children: [],
        value: { previousValue: '', newValue: newFile[key] },
      };
    } else if (_.isEqual(oldFile[key], newFile[key])) {
      return {
        name: key,
        type: 'stayed',
        children: [],
        value: { previousValue: oldFile[key], newValue: newFile[key] },
      };
    }
    return {
      name: key,
      type: 'updated',
      children: [],
      value: { previousValue: oldFile[key], newValue: newFile[key] },
    };
  });
};

const createRootAst = (oldFile, newFile) => ({ children: createAst(oldFile, newFile) });

const render = (ast, repeatN = 1) => {
  const indentLength = '    '.repeat(repeatN);
  const indentLengthSigns = indentLength.slice(0, indentLength.length - 2);
  const result = ast.children.map((node) => {
    switch (node.type) {
      case 'stayed':
        return `${indentLength}${node.name}: ${valueToString(node.value.newValue, indentLength)}`;
      case 'added':
        return `${indentLengthSigns}+ ${node.name}: ${valueToString(node.value.newValue, indentLength)}`;
      case 'removed':
        return `${indentLengthSigns}- ${node.name}: ${valueToString(node.value.previousValue, indentLength)}`;
      case 'updated':
        return `${indentLengthSigns}+ ${node.name}: ${valueToString(node.value.newValue, indentLength)}\n${indentLengthSigns}- ${node.name}: ${valueToString(node.value.previousValue, indentLength)}`;
      default:
        return `${indentLength}${node.name}: {\n${render(node, repeatN + 1)}\n${indentLength}}`;
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
