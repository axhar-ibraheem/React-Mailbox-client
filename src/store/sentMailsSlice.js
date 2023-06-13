import { createSlice } from "@reduxjs/toolkit";

const initialSentboxState = {
  sentMails: [],
};

const sentMailsSlice = createSlice({
  name: "sentMails",
  initialState: initialSentboxState,
  reducers: {
    addToSentBox: (state, action) => {
      state.sentMails.push(action.payload);
    },
    clearSentBox: (state) => {
      state.sentMails = [];
    },
  },
});

export const { addToSentBox, clearSentBox } = sentMailsSlice.actions;
export default sentMailsSlice.reducer;
