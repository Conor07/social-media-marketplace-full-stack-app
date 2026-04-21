import { configureStore } from "@reduxjs/toolkit";
import { postsSlice } from "../features/posts/postsSlice";
import { itemsSlice } from "../features/sell/itemsSlice";
import { cartSlice } from "../features/buy/cartSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    cart: cartSlice.reducer,
    itemsToSell: itemsSlice.reducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
