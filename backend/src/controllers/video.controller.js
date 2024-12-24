// const httpStatus = require("http-status");
// const apiError = require("../utils/apiErrror");
// const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");

const createVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ createUser ~ req, res:", req, res);
});

const getVideos = catchAsync(async (req, res) => {
  console.log("risyandi ~ getUsers ~ req, res:", req, res);
});

const getVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ getUser ~ req, res:", req, res);
});

const updateVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ updateUser ~ req, res:", req, res);
});

const deleteVideo = catchAsync(async (req, res) => {
  console.log("risyandi ~ deleteUser ~ req, res:", req, res);
});

module.exports = {
  createVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
};
