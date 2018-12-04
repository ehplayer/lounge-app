import Store from '../store/recipes';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOTAL_BOARD_REPLACE': {
            return {
                ...state,
                error: null,
                loading: false,
                ...action
            };
        }
        case 'JOINING_BOARD_REPLACE': {
            return {
                ...state,
                error: null,
                loading: false,
                ...action
            }
        }
        case 'MENU_RESET': {
            return initialState;
        }
        default:
            return state;
    }
}
