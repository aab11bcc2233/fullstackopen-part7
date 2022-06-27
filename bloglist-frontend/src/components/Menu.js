import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../reducers/userReducer";

const Menu = ({ toHome, toUsers }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => {
    return state;
  });

  const padding = {
    paddingRight: 5,
  };

  const clickLogout = (event) => {
    console.log(event);
    dispatch(logout());
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to={toHome}>
                home
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to={toUsers}>
                users
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <strong>{user.name}</strong> logged in
      <Button variant="outline-secondary" onClick={clickLogout}>
        logout
      </Button>
    </div>
  );
};

export default Menu;
