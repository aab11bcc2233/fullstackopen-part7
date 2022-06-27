const commentsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");
// const ObjectId = require('mongoose').Types.ObjectId;

commentsRouter.get("/", async (request, response) => {
  const blogId = request.args.id;

  const comments = await Comment.find({ blog: blogId }).sort({ date: -1 });

  response.json(comments);
});

commentsRouter.post("/", userExtractor, async (request, response) => {
  const blogId = request.args.id;
  const text = request.body.text;

  if (!text) {
    return response.status(400).json({ error: "no comments" });
  }

  const blogInDb = await Blog.findById(blogId);
  if (blogInDb === null) {
    return response.status(404).json({ error: "no blog" });
  }

  const newComment = new Comment({
    text: text,
    date: Date(),
    blog: blogInDb._id,
  });

  const savedComment = await newComment.save();
  blogInDb.comments.concat(savedComment._id);
  await blogInDb.save();

  response.status(201).json(savedComment);
});

module.exports = commentsRouter;
