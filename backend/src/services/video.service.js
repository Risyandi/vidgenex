const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const crypto = require("crypto");
const path = require("path");
const axios = require("axios");
const httpStatus = require("http-status");
const { VideoThumbnail } = require("../models");
const apiError = require("../utils/apiErrror");

const createGeneratorVideo = async (req, res) => {
  try {
    // setup directories
    const directoryVideo = "./assets/video";
    const directoryThumbnail = "./assets/thumbnail";

    // checking if directory exists
    if (!fs.existsSync(directoryVideo) || !fs.existsSync(directoryThumbnail)) {
      fs.mkdirSync(directoryVideo, { recursive: true });
      fs.mkdirSync(directoryThumbnail, { recursive: true });
    }

    // generate unique file paths
    const { videoUrl, frameCount } = req.body;
    console.log(
      "risyandi ~ createGeneratorVideo ~ await VideoThumbnail.isVideoTaken(videoUrl):",
      await VideoThumbnail.isVideoTaken(videoUrl)
    );
    if (await VideoThumbnail.isVideoTaken(videoUrl)) {
      let videoThumbnail = await getVideoThumbByCustomField({ videoUrl });

      throw new apiError(
        httpStatus.BAD_REQUEST,
        `Your video has already been generated. Thumbnail: ${videoThumbnail.thumbnailPath}`
      );
    }

    const videoHash = crypto.createHash("md5").update(videoUrl).digest("hex");
    const videoPath = path.join(directoryVideo, `${videoHash}.mp4`);
    const outputDir = path.join(directoryThumbnail, videoHash);

    // download video
    await downloadVideo(videoUrl, videoPath);

    // extract keyframes
    await extractKeyFrames(videoPath, outputDir, frameCount);

    // create animated thumbnail (e.g., GIF from keyframes)
    const gifPath = path.join(outputDir, "thumbnail.gif");
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(`${outputDir}/frame-%d.png`) // use pattern matching for multiple frames (e.g., frame-1.png, frame-2.png)
        .inputOptions("-framerate 5") // optional: set frame rate for the GIF
        .on("end", resolve)
        .on("error", reject)
        .save(gifPath); // Save the GIF to the specified path
    });

    // create the result in MongoDB
    const formDataThumbnail = {
      videoUrl,
      videoPath: videoPath,
      thumbnailPath: gifPath,
    };

    return VideoThumbnail.create(formDataThumbnail);
  } catch (error) {
    throw new apiError(
      httpStatus.BAD_REQUEST,
      `Error generating video thumbnail: ${error.message}`
    );
  }
};

const getVideoThumbByCustomField = async (ObjectQuery) => {
  return VideoThumbnail.findOne(ObjectQuery);
};

const downloadVideo = async (url, outputPath) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

// function to extract keyframes
const extractKeyFrames = async (videoPath, outputDir, frameCount = 5) => {
  return new Promise((resolve, reject) => {
    const keyFramePaths = [];
    ffmpeg(videoPath)
      .on("end", () => resolve(keyFramePaths))
      .on("error", reject)
      .screenshots({
        count: frameCount,
        folder: outputDir,
        filename: "frame-%i.png",
      })
      .on("filenames", (filenames) => {
        filenames.forEach((filename) => {
          keyFramePaths.push(path.join(outputDir, filename));
        });
      });
  });
};

module.exports = {
  createGeneratorVideo,
};
