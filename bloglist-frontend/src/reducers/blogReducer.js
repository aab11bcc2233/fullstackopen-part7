import { createSlice, current } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { showNotificationRed } from "./notificationReducer";
import { setUser } from "./userReducer";

const sortByLikes = (a, b) => b.likes - a.likes;

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort(sortByLikes);
    },
    setLikeBlog(state, action) {
      const data = action.payload;
      const list = current(state)
        .map((v) => (v.id === data.id ? data : v))
        .sort(sortByLikes);
      return list;
    },
    deleteBlog(state, action) {
      const data = action.payload;
      return current(state)
        .filter((v) => v.id !== data.id)
        .sort(sortByLikes);
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
  },
});

const onRequestError = (dispatch, error) => {
  console.log("onRequestEror", error);
  if (error.response.status === 401) {
    dispatch(setUser(null));
    dispatch(showNotificationRed("You need to log in again"));
  } else {
    dispatch(showNotificationRed(error.response.data.error));
  }
};

export const { setBlogs, setLikeBlog, deleteBlog, addBlog } =
  blogsSlice.actions;

export const getBlogs = () => {
  return async (dispatch) => {
    console.log("get blogs");
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      await blogService.update(newBlog);
      dispatch(setLikeBlog(newBlog));
    } catch (error) {
      console.log("add like error", error);
      onRequestError(dispatch, error);
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteById(blog.id);
      console.log("remove blog succeed");
      dispatch(deleteBlog(blog));
    } catch (error) {
      console.log("remove blog error", error);
      onRequestError(dispatch, error);
    }
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const data = await blogService.create(newBlog);
      dispatch(addBlog(data));
      return data;
    } catch (error) {
      onRequestError(dispatch, error);
      return error.response.data;
    }
  };
};

export default blogsSlice.reducer;
