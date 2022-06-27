import { createSlice } from "@reduxjs/toolkit";
import localUser from "../utils/user";
import loginService from "../services/login";
import { showNotificationRed } from "./notificationReducer";
import tokenUtils from "../utils/tokenUtils";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload;

      if (user === null) {
        tokenUtils.setToken(null);
        localUser.remove();
      } else {
        tokenUtils.setToken(user.token);
        localUser.save(user);
      }
      return user;
    },
  },
});

export const { setUser } = userSlice.actions;

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setUser(user));
    } catch (error) {
      console.log("login fails", error);
      dispatch(showNotificationRed(error.response.data.error));
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(setUser(null));
  };
};

export const getUserFromLocal = () => {
  return async (dispatch) => {
    const user = localUser.get();
    dispatch(setUser(user));
  };
};

export default userSlice.reducer;
