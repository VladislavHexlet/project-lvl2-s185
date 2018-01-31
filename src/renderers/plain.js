import _ from 'lodash';

const printValue = value => (_.isObject(value) ? 'complex value' : `value: ${value}`);

const plainRender = (ast, accumulateName = '') => {
  const result = ast.children.map((node) => {
    const name = `${accumulateName}${node.name}`;
    switch (node.type) {
      case 'complex':
        return `${plainRender(node, `${name}.`)}`;
      case 'added':
        return `'${name}' was added with ${printValue(node.value.newValue)}`;
      case 'removed':
        return `'${name}' was removed`;
      case 'updated':
        return `'${name}' was updated. From ${node.value.previousValue} to ${node.value.newValue}`;
      default:
        return '';
    }
  });
  return result.filter(el => el).join('\nProperty ');
};

export default ast => `Property ${plainRender(ast)}\n`;
