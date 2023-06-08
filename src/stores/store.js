import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import cartReducer from '../features/cartSlice';
import userReducer from '../features/userSlice';
import productsReducer from '../features/productsSlice'
import conversationSlice from "../features/conversationSlice";
import messageSlice from "../features/messageSlice";
import memberSlice from "../features/memberSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
export const store = configureStore({
    // reducer: {
    //     cart: cartReducer,
    //     user: userReducer
    // }
    reducer: persistReducer(persistConfig, combineReducers({
        cart: cartReducer,
        user: userReducer,
        conversation: conversationSlice,
        message: messageSlice,
        member: memberSlice,
        products: productsReducer
    })),
    middleware: [thunk]
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //         },
    //     }),
})