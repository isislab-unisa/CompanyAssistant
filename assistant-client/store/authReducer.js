// project imports
import config from '../utils/config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    token: "",
    logged: false,
    username: "",
    userType: ""
};

//-----------------------|| AUTH REDUCER ||-----------------------//

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOG_IN:
            return {
                ...state,
                logged: action.logged,
                token: action.token,
                username: action.username,
                userType: action.userType
            }
        case actionTypes.LOG_OUT:
            return {
                ...state,
                logged: false,
                token: action.token
            }
        default:
            return state
    }
};

export default authReducer;
