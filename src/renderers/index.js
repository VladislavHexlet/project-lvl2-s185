import plainRender from './plain';
import standartRender from './standart';

const renders = {
  standart: standartRender,
  plain: plainRender,
};

export default type => renders[type];
