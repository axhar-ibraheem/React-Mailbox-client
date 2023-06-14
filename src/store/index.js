import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mailReducer from "./mailSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
  },
});

export default store;
