const express = require("express");
const http = require("http");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middleware/error");
const apiError = require("./utils/apiErrror");
const app = express();
const server = http.createServer(app);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// v1 api routes
app.use("/api/v1", routes);

// add route here to serving static file
app.use("/api/v1/assets", express.static("assets"));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new apiError(httpStatus.NOT_FOUND, "url not found"));
});

// convert error to apiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = { app, server };
