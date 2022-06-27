import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import usersService from "../services/users";

const Users = () => {
  // const authorBlogs = useSelector((state) => {
  //   const authors = lodash(state.blogs)
  //     .groupBy("author")
  //     .map((blogs) => blogs)
  //     .map((v) => ({ user: v[0].user, blogs: v }))
  //     .value();
  //   console.log("authors:", authors);
  //   return authors;
  // });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersService.getAll().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div>
      <h2>Users</h2>

      <Table striped>
        <thead>
          <tr>
            <td> </td>
            <td>
              <strong>blogs created</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((v) => {
            return (
              <tr key={v.id}>
                <td>
                  <Link to={`/users/${v.id}`}>
                    <strong>{v.name}</strong>
                  </Link>
                </td>
                <td>
                  <strong>{v.blogs.length}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
