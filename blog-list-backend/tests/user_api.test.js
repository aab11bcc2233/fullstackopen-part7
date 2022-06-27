const bcrypt = require("bcrypt")
const logger = require("../utils/logger")
const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

const User = require("../models/user")


const timeOut = 100000


beforeAll(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash("admin1234", saltRounds)
  const user = new User(
    {
      username: "root",
      name: "admin",
      passwordHash: passwordHash
    }
  )
  await user.save()

}, timeOut)

describe("create a user", () => {


  test("succeeds with status code 201", async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "best",
      name: "Jayce Best",
      password: "jaycebest123456"
    }

    await api.post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const nserUserInDb = usersAtEnd.find(v => v.username == newUser.username)
    expect(nserUserInDb.username).toBeDefined()
    expect(nserUserInDb.name).toBeDefined()
    expect(nserUserInDb.id).toBeDefined()

  }, timeOut)

  test("fails with username length < 3", async () => {
    const newUser = {
      username: "ab",
      name: "Jayce Best",
      password: "jaycebest123456"
    }

    await api.post("/api/users")
      .send(newUser)
      .expect(400)

  }, timeOut)

  test("fails with password length < 3", async () => {
    const newUser = {
      username: "best",
      name: "Jayce Best",
      password: "12"
    }

    await api.post("/api/users")
      .send(newUser)
      .expect(400)

  }, timeOut)

  test("fails with invalidate username and password", async () => {
    const newUser = {
      username: "",
      name: "",
      password: "12"
    }

    await api.post("/api/users")
      .send(newUser)
      .expect(400)

  }, timeOut)

  test("fails with username is duplicate", async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "best",
      name: "Jayce Best",
      password: "jaycebest123456"
    }

    await api.post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const sameUser = {
      ...newUser
    }

    await api.post("/api/users")
      .send(sameUser)
      .expect(400)

  }, timeOut)

})

afterAll(() => {
  mongoose.connection.close()
})