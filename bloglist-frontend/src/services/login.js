import axios from "axios";
const baseUrl = "/api/login";

const login = async (user) => {
  const resonpse = await axios.post(baseUrl, user);
  return resonpse.data;
};

export default { login };
