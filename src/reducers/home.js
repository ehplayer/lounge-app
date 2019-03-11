import Store from '../store/univ';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'HOME_TOTAL': {
      return {
        ...state,
        ...action.data,
        initialized:true,
        loading: false,
        error: null,
      };
    }
    case 'HOME_SCHEDULE_LIST': {
      return {
        ...state,
        ...action.data,
        initialized:true,
        loading: false,
        error: null,
      };
    }
    case 'HOME_RESET': {
        return initialState;
    }
    default:
      return state;
  }
}
