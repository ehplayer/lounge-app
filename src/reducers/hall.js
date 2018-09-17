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
    default:
      return state;
  }
}
