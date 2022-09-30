import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
 
 
 
const persistConfig = {
    key: "root",
    version: 1.1,
    storage
};
 
const initialState = {
    token: "",
    logged: false,
    username: "",
    userType: ""
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                logged: action.logged,
                token: action.token,
                username: action.username,
                userType: action.userType
            }
        case 'LOG_OUT':
            return {
                ...state,
                logged: false,
                token: action.token
            }
        default:
            return state
    }
}

const persistedReducer = persistReducer(persistConfig, reducer);
 
const store = createStore(persistedReducer);
 
export const persistor = persistStore(store);

export default store
