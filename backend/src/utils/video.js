const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const axios = require("axios");

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

const extractVideoKeyFrames = async (videoPath, outputDir, frameCount = 5) => {
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

const extractVideoMetadata = async (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const convertVideoToGift = async (frameDir, gifPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(`${frameDir}/frame-%d.png`) // use pattern matching for multiple frames (e.g., frame-1.png, frame-2.png)
      .inputOptions("-framerate 5") // optional: set frame rate for the GIF
      .on("end", resolve)
      .on("error", reject)
      .save(gifPath); // Save the GIF to the specified path
  });
};

module.exports = {
  downloadVideo,
  extractVideoKeyFrames,
  extractVideoMetadata,
  convertVideoToGift,
};
