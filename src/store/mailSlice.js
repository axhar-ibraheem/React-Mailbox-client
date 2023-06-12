import { createSlice } from "@reduxjs/toolkit";

const initialMailBoxState = {
  mails: [],
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
      const { id, mail } = action.payload;
      if (mail === "single") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (mail === "all") {
        const checked = state.mails.some((item) => item.isChecked === false);

        if (checked) {
          state.mails = state.mails.map((item) => {
            return {
              ...item,
              isChecked: item.isChecked === false ? true : item.isChecked,
            };
          });
        } else {
          state.mails = state.mails.map((item) => {
            return {
              ...item,
              isChecked: false,
            };
          });
        }
      } else if (mail === "allMark") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: true,
          };
        });
      } else if (mail === "none") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: false,
          };
        });
      } else if (mail === "read") {
        state.mails = state.mails.map((mail) => {
          if (mail.hasRead === true) {
            return {
              ...mail,
              isChecked: true,
            };
          } else
            return {
              ...mail,
              isChecked: false,
            };
        });
      } else if (mail === "unread") {
        state.mails = state.mails.map((mail) => {
          if (mail.hasRead === false) {
            return {
              ...mail,
              isChecked: true,
            };
          } else
            return {
              ...mail,
              isChecked: false,
            };
        });
      }
    },
    deleteMail: (state) => {
      state.mails = state.mails.filter((item) => !item.isChecked);
    },
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.hasRead = true;
    },
    clearMails: (state) => {
      state.mails = [];
    },
    setMailsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToInbox,
  setChecked,
  deleteMail,
  setRead,
  clearMails,
  setMailsLoading,
} = mailSlice.actions;
export default mailSlice.reducer;
