const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { config, logger } = require("../config");
const apiError = require("../utils/apiErrror");

// convert error to ApiError
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof apiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new apiError(statusCode, message, false);
  }
  next(error);
};

// handle error
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
