const logger = require("./logger");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const requestLogger = morgan(function (tokens, req, res) {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const contentLength = tokens.res(req, res, "content-length");
  const responseTime = tokens["response-time"](req, res);
  return [
    method,
    url,
    status,
    contentLength,
    "Byte",
    "-",
    responseTime,
    "ms",
    method === "POST" || method === "PUT" ? JSON.stringify(req.body) : "",
  ].join(" ");
});

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.info(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    if (error.code === 11000) {
      // key duplicate
      return response.status(400).send({
        error: "Duplicate " + Object.keys(error.keyValue).join(","),
      });
    }
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request);
  next();
};

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  request.user = decodedToken;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
