const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const blog = request.body;
  const userFromReq = request.user;

  if (!blog.title) {
    response.status(400).send({ error: "title missing" });
    return;
  }

  if (!blog.url) {
    response.status(400).send({ error: "url missing" });
    return;
  }

  if (!blog.likes) {
    blog.likes = 0;
  }

  const user = await User.findById(userFromReq.id);

  if (user === null) {
    return response.status(401).json({ error: "user invalid" });
  }

  const newBlog = new Blog({
    ...blog,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const result = savedBlog.toJSON();
  result.user = user.toJSON();
  delete result.user.blogs;

  response.status(201).json(result);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blogId = request.params.id;
  const userFromReq = request.user;

  const user = await User.findById(userFromReq.id);

  if (user === null) {
    return response.status(401).json({ error: "user invalid" });
  }

  const blogInDb = await Blog.findById(blogId);
  if (blogInDb === null) {
    return response.status(404).json({ error: "no blog" });
  }

  if (!(blogInDb.user.toString() === user._id.toString())) {
    return response.status(401).json({ error: "token or user invalid" });
  }

  await blogInDb.delete();

  user.blogs = user.blogs.filter(
    (v) => v.toString() !== blogInDb._id.toString()
  );
  await user.save();

  response.status(204).send();
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const blogId = request.params.id;
  const body = request.body;
  const userFromReq = request.user;

  const user = await User.findById(userFromReq.id);

  if (user === null) {
    return response.status(401).json({ error: "user invalid" });
  }

  if (!body.likes) {
    response.status(400).send({ error: "likes missing" });
    return;
  }

  const blogInDb = await Blog.findById(blogId);
  if (blogInDb === null) {
    return response.status(404).json({ error: "no blog" });
  }

  if (!(blogInDb.user.toString() === user._id.toString())) {
    return response.status(401).json({ error: "token or user invalid" });
  }

  blogInDb.likes = body.likes;

  const blog = await blogInDb.save();
  response.json(blog);
});

module.exports = blogsRouter;
