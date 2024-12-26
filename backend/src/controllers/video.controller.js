const httpStatus = require("http-status");
const apiError = require("../utils/apiErrror");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { videoService } = require("../services");

// Generator
const createGeneratorVideo = catchAsync(async (req, res) => {
  const video = await videoService.createGeneratorVideo(req, res);
  if (!video) {
    throw new apiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "failed to generate video thumbnail"
    );
  }

  res.status(httpStatus.CREATED).send(video);
});

const getGeneratorVideos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["videoUrl", "thumbnailPath", "videoPath"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await videoService.getGeneratorVideos(filter, options);

  res.status(httpStatus.OK).send(result);
});

const getGeneratorVideo = catchAsync(async (req, res) => {
  const result = await videoService.getGeneratorVideosById(req.params.videoId);

  res.status(httpStatus.OK).send(result);
});

const updateGeneratorVideo = catchAsync(async (req, res) => {
  let dataBody = req.body;
  let videoId = req.params.videoId;
  const result = await videoService.updateGeneratorVideosById(
    videoId,
    dataBody
  );

  res.status(httpStatus.OK).send(result);
});

const deleteGeneratorVideo = catchAsync(async (req, res) => {
  const result = await videoService.deleteGeneratorVideosById(
    req.params.videoId
  );

  res.status(httpStatus.NO_CONTENT).send(result);
});

// Extractor
const createExtractorVideo = catchAsync(async (req, res) => {
  const video = await videoService.createExtractorVideo(req, res);
  if (!video) {
    throw new apiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "failed to extractor video metadata"
    );
  }

  res.status(httpStatus.CREATED).send(video);
});

const getExtractorVideos = catchAsync(async (req, res) => {
  console.log("risyandi ~ getUsers ~ req, res:", req, res);
});

const getExtractorVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ getUser ~ req, res:", req, res);
});

const updateExtractorVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ updateUser ~ req, res:", req, res);
});

const deleteExtractorVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ deleteUser ~ req, res:", req, res);
});

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
