
const print = (output) => {
  if (process.env.NODE_ENV !== "test") {
    output()
  }
}

const info = (...params) => {
  print(() => {
    console.log(...params)
  })
}

const error = (...params) => {
  print(() => {
    console.error(...params)
  })
}

module.exports = {
  info,
  error
}