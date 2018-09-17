import Store from '../store/recipes';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIPES_ERROR': {
      return {
        ...state,
        error: action.data,
      };
    }
    case 'UNIV_TOTAL': {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    case 'NOTICE_REPLACE': {
      let recipes = [];
      let currentUnivId;
      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        recipes = action.data.dataList.map(item => item);
        currentUnivId = action.data.currentUnivId;
      }
      return {
        ...state,
        error: null,
        loading: false,
        currentUnivId: currentUnivId,
        univNotice: recipes,
      };
    }
    case 'SCHEDULE_REPLACE': {
      let scheduleList = [];
      if (action.data && typeof action.data === 'object') {
        scheduleList = action.data.dataList.map(item => item);
      }
      return {
        ...state,
        error: null,
        loading: false,
        univScheduleList: scheduleList,
      };
    }
    case 'BOARD_REPLACE': {
      let univBoardList = [];

      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        univBoardList = action.data.dataList.map(item => item);
      }
      return {
        ...state,
        error: null,
        loading: false,
        univBoardList,
      };
    }
    default:
      return state;
  }
}
