const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const logger = require("../utils/logger")
const User = require("../models/user")
const bcrypt = require("bcrypt")

const Blog = require("../models/blog")

const timeOut = 100000

const defaultUser = {
  username: "root",
  name: "admin",
  password: "admin1234"
}

let token = ""

beforeAll(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(defaultUser.password, saltRounds)
  const user = new User(
    {
      username: defaultUser.username,
      name: defaultUser.name,
      passwordHash: passwordHash
    }
  )
  const reponseRootUser = await user.save()

  const responseLogin = await api.post("/api/login")
    .send(defaultUser)
  // console.log("login response:", responseLogin.body)
  token = responseLogin.body.token
  // console.log("token:", token)

  await Blog.deleteMany({})
  // const blogObjects = helper.initialBlogs.map(v => new Blog(v))
  // const promiseArray = blogObjects.map(v => v.save())
  // await Promise.all(promiseArray)

  for (const blog of helper.initialBlogs) {
    let blogObj = new Blog({
      ...blog,
      user: reponseRootUser._id
    })
    await blogObj.save()
  }

  logger.info("database initial done")
}, timeOut)

test("get blogs", async () => {
  await api.get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")
  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, timeOut)

test("blog id exist", async () => {
  const response = await api.get("/api/blogs")
  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
}, timeOut)


describe("create a new blog", () => {
  test("succeeds with valid data", async () => {
    const newBlog = {
      "title": "New New Post",
      "author": "new mike",
      "url": "http://localhost",
      "likes": 1002
    }

    await api.post("/api/blogs")
      .set("authorization", "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")
    console.log("get /api/blogs: ", response.body)
    const titles = response.body.map(v => v.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

    expect(titles).toContain(newBlog.title)

  }, timeOut)

  test("succeeds without likes property", async () => {
    const newBlog = {
      "title": "No likes",
      "author": "Anna",
      "url": "http://localhost",
    }

    const response = await api.post("/api/blogs")
      .set("authorization", "bearer " + token)
      .send(newBlog)

    expect(response.body.likes).toBe(0)
  }, timeOut)

  test("fails with status code 400, no title or url property", async () => {
    const noTitleBlog = {
      "author": "Anna1"
    }
    await api.post("/api/blogs")
      .set("authorization", "bearer " + token)
      .send(noTitleBlog)
      .expect(400)

    const noUrlBlog = {
      "title": "no url",
      "author": "Anna2"
    }
    await api.post("/api/blogs")
      .set("authorization", "bearer " + token)
      .send(noUrlBlog)
      .expect(400)
  }, timeOut)

  test("fails with status code 401, token invalid", async () => {
    const newBlog = {
      "title": "New New Post",
      "author": "new mike",
      "url": "http://localhost",
      "likes": 1002
    }

    await api.post("/api/blogs")
      .set("authorization", "bearer ")
      .send(newBlog)
      .expect(401)
  }, timeOut)
})

describe("deleteion of a blog", () => {
  test("succeeds with status cdoe 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const responseDeleted = await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set("authorization", "bearer " + token)
    // .expect(204)
    // console.log("delete /api/blogs/id resp:", responseDeleted)
    expect(responseDeleted.statusCode).toBe(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(v => v.id)
    expect(ids).not.toContain(blogToDelete.id)
  }, timeOut)

  test("fails with status code 400 if id is invalid", async () => {
    await api.delete("/api/blogs/1234")
      .set("authorization", "bearer " + token)
      .expect(400)
  }, timeOut)

  test("fails with status code 400 if no id", async () => {
    await api.delete("/api/blogs/1234")
      .set("authorization", "bearer " + token)
      .expect(400)
  }, timeOut)
})


describe("update of a blog", () => {
  test("succeeds with modify the number of likes", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const number = 10

    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .set("authorization", "bearer " + token)
      .send({ likes: blogToUpdate.likes + number })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].id).toBe(blogToUpdate.id)
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + number)

  }, timeOut)

  test("fails with status code 400 if id is invalid", async () => {
    await api.put("/api/blogs/1234")
      .set("authorization", "bearer " + token)
      .expect(400)
  }, timeOut)

  test("fails with status code 400 if no id", async () => {
    await api.put("/api/blogs/1234")
      .set("authorization", "bearer " + token)
      .expect(400)
  }, timeOut)
})


afterAll(() => {
  mongoose.connection.close()
})