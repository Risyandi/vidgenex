const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

// load .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

// env validation
const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "local").required(),
    PORT: Joi.number().default(8000),
    MONGODB_URL: Joi.string().required().description("your mongodb url required"),
  })
  .unknown();

const { value: env, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`config validation error: ${error.message}`);
}

module.exports = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoose: {
    url: env.MONGODB_URL,
    options: {
      //* adding other options here, only uncomment if needed
      // useFindAndModify: true,
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
};
