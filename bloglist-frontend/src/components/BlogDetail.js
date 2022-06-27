import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";

import { likeBlog, removeBlog } from "../reducers/blogReducer";
import Comments from "./Comments";

const BlogDetail = () => {
  const dispatch = useDispatch();
  const blogMatch = useMatch("/blogs/:id");

  const { user, blogs } = useSelector((state) => {
    return state;
  });

  const blog = blogMatch
    ? blogs.find((v) => v.id === blogMatch.params.id)
    : null;

  if (!user || !blog) {
    return null;
  }

  const onClickLike = async (blog) => {
    dispatch(likeBlog(blog));
  };

  const onClickRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}! by ${user.username}`)) {
      dispatch(removeBlog(blog));
    }
  };

  return (
    <div className="blogDetail">
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div className="blogUrl">{blog.url}</div>
      <div className="blogLikes">
        likes {blog.likes}{" "}
        <Button
          variant="outline-primary"
          onClick={() => {
            onClickLike(blog);
          }}
        >
          like
        </Button>
      </div>
      <div>added by {blog.author}</div>

      {blog.user.username === user.username ? (
        <Button variant="outline-secondary" onClick={() => onClickRemove(blog)}>
          remove
        </Button>
      ) : null}

      <Comments blogId={blog.id} />
    </div>
  );
};

export default BlogDetail;
