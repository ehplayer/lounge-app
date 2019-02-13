import Store from '../store/member';

export const initialState = Store;

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_LOGIN': {
            if (action.data) {
                return {
                    ...state,
                    loading: false,
                    error: null,
                };
            }
            return initialState;
        }
        case 'UPDATE_MEMBER_STATE': {
            if (action.data) {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    ...action.data,
                };
            }
            return initialState;
        }
        case 'USER_DETAILS_UPDATE': {
            if (action.data) {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    ...action.data,
                };
            }
            return initialState;
        }
        case 'SCHEDULER_OWNER_UPDATE': {
            return {
                ...state,
                loading: false,
                error: null,
                ...action,
            };
        }
        case 'SCHEDULER_MORE': {
            const totalList = state.userList.concat(action.userList);
            return {
                ...state,
                loading: false,
                error: null,
                userList: totalList
            };
        }
        case 'SCHEDULER_SEARCH_LIST': {
            if (action.searchUserList) {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    searchUserList: action.searchUserList,
                };
            }
            return state;
        }
        case 'ADD_STEP_MEMBER_LIST': {
            let staffMemberList = state.staffMemberList || [];
            if(!staffMemberList.find(item => item.docId === action.member.docId)){
                staffMemberList.push(action.member)
            }

            return {
                ...state,
                loading: false,
                error: null,
                staffMemberList: staffMemberList
            };
        }
        case 'REMOVE_STEP_MEMBER_LIST': {
            state.staffMemberList.splice(action.index, 1);
            return {
                ...state,
                loading: false,
                error: null,
                staffMemberList: state.staffMemberList
            };
        }
        case 'RESET_STEP_MEMBER_LIST': {
            return {
                ...state,
                loading: false,
                error: null,
                staffMemberList: []
            };
        }

        case 'GET_OTHER_USER': {
            return {
                ...state,
                loading: false,
                error: null,
                user: action.data.user,
            };
        }
        case 'USER_ERROR': {
            if (action.data) {
                return {
                    ...state,
                    loading: false,
                    error: action.data,
                };
            }
            return initialState;
        }
        case 'USER_RESET': {
            return initialState;
        }
        default:
            return state;
    }
}
