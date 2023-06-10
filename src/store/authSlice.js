import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  idToken: localStorage.getItem("idToken"),
  email: localStorage.getItem("email"),
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
    login: (state, action) => {
      const { idToken, email } = action.payload;
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthenticated", true);
      state.isAuthenticated = true;
      state.idToken = idToken;
      state.email = email;
    },
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
