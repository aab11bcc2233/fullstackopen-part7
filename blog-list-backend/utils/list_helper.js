const _ = require("lodash")
const logger = require("../utils/logger")


// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {

  return 1
}

const totalLikes = (blogs) => blogs.length === 0 ?
  0 :
  blogs.map(v => v.likes)
    .reduce((pre, curr) => pre + curr, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  let blogOfMaxLikes = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    const v = blogs[i]

    if (v.likes > blogOfMaxLikes.likes) {
      blogOfMaxLikes = v
    }
  }

  const result = { ...blogOfMaxLikes }

  delete result._id
  delete result.__v
  delete result.url

  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const result = _.chain(blogs)
    .groupBy(({ author }) => author)
    .map((v, k) => ({ author: k, blogs: v.length }))
    .maxBy(({ blogs }) => blogs)
    .value()

  logger.info("mostBlogs", result)

  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const result = _.chain(blogs)
    .groupBy(({ author }) => author)
    .map((v, k) => ({
      author: k,
      likes: _.chain(v)
        .map(blog => blog.likes)
        .reduce((sum, n) => sum + n)
        .value()
    }))
    .maxBy(({ likes }) => likes)
    .value()

  logger.info("mostLikes", result)

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}