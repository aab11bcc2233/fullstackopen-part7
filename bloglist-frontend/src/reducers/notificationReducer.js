import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    notification(state, action) {
      return action.payload;
    },
  },
});

export const { notification } = notificationSlice.actions;

let timeoutID;

export const showNotification = (message, color, timeout) => {
  return async (dispatch) => {
    if (timeoutID !== undefined) {
      clearTimeout(timeoutID);
    }

    dispatch(
      notification({
        message,
        color,
      })
    );

    if (message !== null) {
      timeoutID = setTimeout(() => {
        timeoutID = undefined;
        dispatch(notification(null));
      }, timeout * 1000);
    }
  };
};

export const showNotificationGreen = (message) => {
  return showNotification(message, "green", 5);
};

export const showNotificationRed = (message) => {
  return showNotification(message, "red", 5);
};

export default notificationSlice.reducer;
