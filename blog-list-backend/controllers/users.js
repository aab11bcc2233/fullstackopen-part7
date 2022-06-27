const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const blogs = await User.findById(request.params.id).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(blogs);
});

usersRouter.post("/", async (request, response) => {
  if (!request.body.username || !request.body.password) {
    return response
      .status(400)
      .send({ error: "invalidate username or password" });
  }

  if (request.body.password.length < 3) {
    return response.status(400).send({ error: "the password is too short" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

  const user = await new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: passwordHash,
  }).save();

  response.status(201).json(user);
});

module.exports = usersRouter;
