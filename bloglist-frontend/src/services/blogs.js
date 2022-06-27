import axios from "axios";
import tokenUtils from "../utils/tokenUtils";
const baseUrl = "/api/blogs";


const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (blog) => {
  const config = {
    headers: { Authorization: tokenUtils.getToken() },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const update = async (blog) => {
  const id = blog.id;

  const config = {
    headers: { Authorization: tokenUtils.getToken() },
  };

  const newBlog = { ...blog };

  delete newBlog.id;

  newBlog.user = newBlog.user.id;

  const response = await axios.put(`${baseUrl}/${id}`, newBlog, config);
  return response.data;
};

const deleteById = async (id) => {
  const config = {
    headers: { Authorization: tokenUtils.getToken() },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  deleteById,
};
