import React, { useRef } from "react";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const BlogFormLabel = () => {
  const blogFormRef = useRef();

  return (
    <div>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm
          onCreateSuccess={() => {
            blogFormRef.current.toggleVisibility();
          }}
        />
      </Togglable>
    </div>
  );
};

export default BlogFormLabel;
