import React from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

const Notification = () => {
  const msgObj = useSelector((state) => state.notification);

  if (!msgObj) {
    return null;
  }

  const { message, color } = msgObj;

  if (!message) {
    return null;
  }

  return (
    <div className="container">
      <Alert variant={color === "red" ? "danger" : "success"}>{message}</Alert>
    </div>
  );
};

export default Notification;
