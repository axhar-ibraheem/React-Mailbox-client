import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  idToken: null,
  apiKey: "AIzaSyCTp8pkXEAWgMEB8hyekaBfwqyRll1HtdE",
  isLoading: false,
  notification: {
    message: null,
    variant: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {},
    logout: (state, action) => {},
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        variant: action.payload.variant,
      };
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { signUp, login, logout, showNotification, setIsLoading } =
  authSlice.actions;
export default authSlice.reducer;
