import plainRender from './plain';
import standartRender from './standart';
import jsonRender from './json';

const renders = {
  standart: standartRender,
  plain: plainRender,
  json: jsonRender,
};

export default type => renders[type];
