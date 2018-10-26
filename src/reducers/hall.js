import Store from '../store/recipes';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'HALL_TOTAL': {
      return {
        ...state,
        error: null,
        loading: false,
        ...action.data,
      };
    }
    case 'GET_HALL_ARTICLE_LIST': {
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
