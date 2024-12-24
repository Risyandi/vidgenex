const mongoose = require("mongoose");
const { server } = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

// server listening
server.listen(config.port, async () => {
  logger.info(`listen server running on ${config.port}`);
});

// connection mongo database
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(async () => {
    logger.info("connected to mongodb");
  });

// handler server close
const exitHandler = async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // auto restart server if process exit
  server.listen(config.port, async () => {
    logger.info(`Restarting server on ${config.port}`);
  });
};

// handler unexpected error server
const unexpectedErrorHandler = (error) => {
  logger.error(`unexpected error: ${error}`);
  exitHandler().catch((err) => {
    logger.error(`error when restarting server: ${err}`);
  });
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", unexpectedErrorHandler);
