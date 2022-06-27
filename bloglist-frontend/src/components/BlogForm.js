import React from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useField } from "../hooks";
import { createBlog } from "../reducers/blogReducer";
import { showNotificationGreen } from "../reducers/notificationReducer";

const BlogForm = ({ onCreateSuccess }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const clickCreateBlog = async (event) => {
    event.preventDefault();

    dispatch(
      createBlog({
        title: title.props.value,
        author: author.props.value,
        url: url.props.value,
      })
    )
      .then((data) => {
        if (data && data.id) {
          dispatch(
            showNotificationGreen(
              `a new blog ${data.title}! by added ${user.name}`
            )
          );
          onCreateSuccess();
        }
        console.log("create blog resp:", data);
      })
      .catch((error) => {
        console.log("create blog error:", error);
      });
  };

  return (
    <div>
      <h2>create new</h2>
      <div>
        <Form onSubmit={clickCreateBlog}>
          <Form.Group>
            <Form.Label>title:</Form.Label>
            <Form.Control name="inputTitle" {...title.props} />

            <Form.Label>author:</Form.Label>
            <Form.Control name="inputAuthor" {...author.props} />

            <Form.Label>url:</Form.Label>
            <Form.Control name="inputUrl" {...url.props} />

            <br />
            <Button variant="outline-success" type="submit">
              create
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default BlogForm;
