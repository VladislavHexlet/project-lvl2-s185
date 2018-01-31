import _ from 'lodash';

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
        value: {},
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

export default (oldFile, newFile) => ({ children: createAst(oldFile, newFile) });
