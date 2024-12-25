const winston = require("winston");
const config = require("./config");

// custom winston format
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// create logger
const logger = winston.createLogger({
  level: config.env === "dev" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "dev"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: "DD-MMMM-YYYY HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

module.exports = logger;
