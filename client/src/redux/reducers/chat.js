import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromLocalStorage } from "../../utils/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: getOrSaveFromLocalStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state, action) => {
      state.notificationCount += 1;
    },
    resetNotification: (state, action) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const index = state.newMessagesAlert.findIndex(
        (obj) => obj.chatId === action.payload
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: action.payload,
          count: 1,
        });
      }
    },
    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (obj) => obj.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;

export const {
  incrementNotification,
  resetNotification,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;
