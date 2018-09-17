import Store from '../store/recipes';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'CLUB_TOTAL': {
      return {
        ...state,
        error: null,
        loading: false,
        ...action.data,
      };
    }
    case 'GET_CLUB_ARTICLE_LIST': {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    case 'CLUB_RESET': {
      return initialState;
    }
    default:
      return state;
  }
}
