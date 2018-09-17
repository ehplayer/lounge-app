import Store from '../store/univ';

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
    case 'GET_ARTICLE_TOTAL': {
      return {
        ...state,
        loading: false,
        error: null,
        article: action.data.article,
      };
    }
    case 'GET_UNIV_ARTICLE_LIST': {
      return {
        ...state,
        ...action.data,
        loading: false,
        error: null,
      };
    }
    case 'GET_UNIV_ARTICLE_LIST_MORE': {
      const totalList = state.articleList.concat(action.data.articleList);
      return {
        ...state,
        articleList:totalList,
        loading: false,
        error: null,
      };
    }
    case 'NOTICE_LIST_REPLACE': {
      return {
        ...state,
        error: null,
        loading: false,
        noticeList: action.data.dataList,
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
    case 'UNIV_RESET': {
      return initialState;
    }
    default:
      return state;
  }
}
