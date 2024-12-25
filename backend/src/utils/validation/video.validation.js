const Joi = require("joi");
const { objectId } = require("./custom.validation");

// Generator
const createGeneratorVideo = {
  body: Joi.object().keys({
    videoUrl: Joi.string().required(),
    frameCount: Joi.number().integer().min(1).max(30),
  }),
};

const getGeneratorVideos = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGeneratorVideo = {
  params: Joi.object().keys({
    videoId: Joi.string().custom(objectId),
  }),
};

const updateGeneratorVideo = {
  params: Joi.object().keys({
    videoId: Joi.required().custom(objectId),
  }),
};

const deleteGeneratorVideo = {
  params: Joi.object().keys({
    videoId: Joi.required().custom(objectId),
  }),
};

// Extractor
const createExtractorVideo = {};

const getExtractorVideos = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExtractorVideo = {
  params: Joi.object().keys({
    videoId: Joi.string().custom(objectId),
  }),
};

const updateExtractorVideo = {
  params: Joi.object().keys({
    videoId: Joi.required().custom(objectId),
  }),
};

const deleteExtractorVideo = {
  params: Joi.object().keys({
    videoId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  // Generator
  createGeneratorVideo,
  getGeneratorVideos,
  getGeneratorVideo,
  updateGeneratorVideo,
  deleteGeneratorVideo,
  // Extractor
  createExtractorVideo,
  getExtractorVideos,
  getExtractorVideo,
  updateExtractorVideo,
  deleteExtractorVideo,
};
