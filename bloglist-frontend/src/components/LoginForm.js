import React from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useField } from "../hooks";
import { login } from "../reducers/userReducer";
import Notification from "./Notification";

const LoginForm = () => {
  const dispatch = useDispatch();

  const username = useField("text");
  const password = useField("password");

  const clickLogin = async (event) => {
    event.preventDefault();
    console.log("login in with", username.props.value, password.props.value);
    dispatch(login(username.props.value, password.props.value));
  };

  return (
    <div className="container">
      <h2>Log in to application</h2>

      <Notification />

      <Form onSubmit={clickLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control name="username" {...username.props} />

          <Form.Label>password</Form.Label>
          <Form.Control name="username" {...password.props} />
          <br />
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
