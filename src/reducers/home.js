import Store from '../store/univ';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'HOME_TOTAL': {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    case 'HOME_SCHEDULE_LIST': {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
