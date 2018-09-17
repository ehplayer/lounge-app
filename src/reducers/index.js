import status from './status';
import member from './member';
import univ from './univ';
import club from './club';
import hall from './hall';
import menu from './menu';
import home from './home';

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

export default {
  rehydrated,
  status,
  member,
  univ,
  club,
  hall,
  menu,
  home,
};

