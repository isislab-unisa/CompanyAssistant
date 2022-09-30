import { createStore } from 'redux';
import reducer from './reducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1.1,
    storage
};

//-----------------------|| REDUX - MAIN STORE ||-----------------------//

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

export const persistor = persistStore(store);

export default  store ;
