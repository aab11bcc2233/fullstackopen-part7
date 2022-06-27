import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useMatch } from "react-router-dom";
import usersService from "../services/users";

const User = () => {
  const [user, setUser] = useState(null);

  const match = useMatch("/users/:id");
  const id = match ? match.params.id : null;

  // const { user, blogs } = useSelector((state) => {
  //   console.log("user id:", id);
  //   const blogs = lodash(state.blogs)
  //     .filter((v) => v.user.id === id)
  //     .value();

  //   if (blogs.length > 0) {
  //     return { user: blogs[0].user, blogs: blogs };
  //   }
  //   return { user: null, blogs: [] };
  // });

  useEffect(() => {
    if (id) {
      console.log("user id:", id);
      console.log("get user by id");
      usersService.getById(id).then((data) => {
        console.log("get user by id resp:", data);
        setUser(data);
      });
    }
  }, [id]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>add blogs</h3>
      <ListGroup>
        {user.blogs
          ? user.blogs.map((v) => (
            <ListGroupItem key={v.id}>{v.title}</ListGroupItem>
          ))
          : ""}
      </ListGroup>
    </div>
  );
};

export default User;
