import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./blogReducer";
import notificationReducer from "./notificationReducer";
import userReducer from "./userReducer";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});

export default store;