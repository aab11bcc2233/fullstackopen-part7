import axios from "axios";
import tokenUtils from "../utils/tokenUtils";


const baseUrl = (blogId) => `/api/blogs/${blogId}/comments`;

const getCommentsByBlogId = (blogId) => {
  const request = axios.get(baseUrl(blogId));
  return request.then((response) => response.data);
};

const createComment = (blogId, text) => {
  const config = {
    headers: { Authorization: tokenUtils.getToken() },
  };
  const request = axios.post(
    baseUrl(blogId),
    {
      text: text,
    },
    config
  );
  return request.then((response) => response.data);
};

export default {
  getCommentsByBlogId,
  createComment,
};
