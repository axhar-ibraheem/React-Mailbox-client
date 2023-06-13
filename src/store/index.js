import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mailReducer from "./mailSlice";
import sentMailsReducer from "./sentMailsSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    sentMails: sentMailsReducer,
  },
});

export default store;
