import _ from 'lodash';

const valueToString = (value, indentLength) => {
  if (!_.isObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.map(key => `${indentLength}    ${key}: ${valueToString(value[key], indentLength + 1)}`);
  return `{\n${result.join('\n')}\n${indentLength}}`;
};

const standartRender = (ast, repeatN = 1) => {
  const indentLength = '    '.repeat(repeatN);
  const indentLengthSigns = indentLength.slice(0, indentLength.length - 2);
  const result = ast.map((node) => {
    switch (node.type) {
      case 'stayed':
        return `${indentLength}${node.name}: ${valueToString(node.newValue, indentLength)}`;
      case 'added':
        return `${indentLengthSigns}+ ${node.name}: ${valueToString(node.newValue, indentLength)}`;
      case 'removed':
        return `${indentLengthSigns}- ${node.name}: ${valueToString(node.previousValue, indentLength)}`;
      case 'updated':
        return [[`${indentLengthSigns}+ ${node.name}: ${valueToString(node.newValue, indentLength)}`], [`${indentLengthSigns}- ${node.name}: ${valueToString(node.previousValue, indentLength)}`]];
      default:
        return `${indentLength}${node.name}: {\n${standartRender(node.children, repeatN + 1)}\n${indentLength}}`;
    }
  });
  return _.flatten(result).join('\n');
};

export default ast => `{\n${standartRender(ast)}\n}\n`;
