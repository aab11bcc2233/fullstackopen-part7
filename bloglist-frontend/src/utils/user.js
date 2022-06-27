const loggedUserKey = "loggedUser";

const save = (user) => {
  window.localStorage.setItem(loggedUserKey, JSON.stringify(user));
};

const get = () => {
  const loggedUserJSON = window.localStorage.getItem(loggedUserKey);
  if (!loggedUserJSON) {
    return null;
  }

  return JSON.parse(loggedUserJSON);
};

const remove = () => {
  window.localStorage.removeItem(loggedUserKey);
};

const user = { save, get, remove };

export default user;
