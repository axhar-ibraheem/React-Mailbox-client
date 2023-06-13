import { createSlice } from "@reduxjs/toolkit";

const initialMailBoxState = {
  mails: [],
  sentMails: [],
  isLoading: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailBoxState,
  reducers: {
    addToInbox: (state, action) => {
      state.mails.push(action.payload);
    },

    setChecked: (state, action) => {
      const { id, selector } = action.payload;

      if (selector === "single") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "all") {
        const checked = state.mails.some((item) => item.isChecked === false);
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: checked ? true : false,
          };
        });
      } else if (selector === "allMark" || selector === "none") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: selector === "allMark",
          };
        });
      } else if (selector === "read" || selector === "unread") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.hasRead === (selector === "read"),
          };
        });
      } else if (selector === "starred" || selector === "unstarred") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.starred === (selector === "starred"),
          };
        });
      }
    },
    moveMails: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked) {
          return {
            ...mail,
            trashed: action.payload === "toTrash",
          };
        }
        return mail;
      });
      //   state.mails = state.mails.filter((item) => !item.isChecked);
    },
    moveToTrash: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.id === action.payload) {
          return {
            ...mail,
            trashed: true,
          };
        }
        return mail;
      });
    },
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.hasRead = true;
    },
    toggleStarred: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.starred = !mailItem.starred;
    },
    clearMails: (state) => {
      state.mails = [];
    },
    setMailsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addToSentBox: (state, action) => {
      state.sentMails.push(action.payload);
    },
    deleteForever: (state, action) => {
      const { id } = action.payload;
      state.mails = state.mails.filter((mail) => mail.id !== id);
    },
  },
});

export const {
  addToInbox,
  setChecked,
  moveMails,
  setRead,
  clearMails,
  setMailsLoading,
  addToSentBox,
  moveToTrash,
  toggleStarred,
  deleteForever,
} = mailSlice.actions;
export default mailSlice.reducer;
