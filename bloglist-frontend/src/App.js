import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import BlogFormLabel from "./components/BlogFormLabel";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User";
import { getBlogs } from "./reducers/blogReducer";
import { getUserFromLocal } from "./reducers/userReducer";
import BlogDetail from "./components/BlogDetail";
import Menu from "./components/Menu";

const path = {
  home: "/",
  users: "/users",
  user: "/users/:id",
  blog: "/blogs/:id",
};

const App = () => {
  const { user } = useSelector((state) => {
    return state;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserFromLocal());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <div className="container">
      <Menu toHome={path.home} toUsers={path.users} />

      <Notification />

      <h2>blog app</h2>

      <BlogFormLabel />

      <Routes>
        <Route path={path.users} element={<Users />} />
        <Route path={path.user} element={<User />} />
        <Route path={path.home} element={<BlogList />} />
        <Route path={path.blog} element={<BlogDetail />} />
      </Routes>
    </div>
  );
};

export default App;
