import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;