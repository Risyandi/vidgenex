const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { config, logger } = require("../config");
const ApiError = require("../utils/apiErrror");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false);
  }
  next(error);
};

const errorHandler = async (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === "prod" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "dev"),
  };

  if (config.env === "dev") {
    logger.error(err);
  }

  // send error response
  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
