const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const httpStatus = require("http-status");
const { VideoThumbnail, VideoMetadata } = require("../models");
const apiError = require("../utils/apiErrror");
const {
  downloadVideo,
  extractVideoKeyFrames,
  convertVideoToGift,
  extractVideoMetadata,
} = require("../utils/video");

// generator
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
    await extractVideoKeyFrames(videoPath, outputDir, frameCount);

    // create animated thumbnail (e.g., GIF from keyframes)
    const gifPath = path.join(outputDir, "thumbnail.gif");
    await convertVideoToGift(outputDir, gifPath);

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

const getGeneratorVideos = async (filter, options) => {
  let queryFilter = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined) {
      let filterKey = {};
      filterKey[key] = value;
      Object.assign(queryFilter, filterKey);
    }
  });

  const videoThumbnail = await VideoThumbnail.paginate(queryFilter, options);
  return videoThumbnail;
};

const getGeneratorVideosById = async (thumbnailId) => {
  return VideoThumbnail.findById(thumbnailId);
};

const getVideoThumbByCustomField = async (ObjectQuery) => {
  return VideoThumbnail.findOne(ObjectQuery);
};

const updateGeneratorVideosById = async (thumbnailId, thumbnailBody) => {
  const videoThumbnail = await getGeneratorVideosById(thumbnailId);
  Object.assign(videoThumbnail, thumbnailBody);

  await videoThumbnail.save();
  return videoThumbnail;
};

const deleteGeneratorVideosById = async (thumbnailId) => {
  const videoThumbnail = await getGeneratorVideosById(thumbnailId);
  await videoThumbnail.deleteOne();
  return videoThumbnail;
};

// extractor
const createExtractorVideo = async (req, res) => {
  try {
    // setup directories
    const directoryVideo = "./assets/video";

    // checking if directory exists
    if (!fs.existsSync(directoryVideo)) {
      fs.mkdirSync(directoryVideo, { recursive: true });
    }

    const { videoUrl } = req.body;
    const videoHash = crypto.createHash("md5").update(videoUrl).digest("hex");
    const videoPath = path.join(directoryVideo, `${videoHash}.mp4`);

    // download video
    await downloadVideo(videoUrl, videoPath);

    // extract keyframes
    let videoMetadata = await extractVideoMetadata(videoPath);

    // create the result in MongoDB
    const videoMetadataDocument = {
      videoPath,
      metadata: {
        streams: videoMetadata.streams.map((data) => ({
          index: data.index,
          codec_name: data.codec_name,
          codec_long_name: data.codec_long_name,
          profile: data.profile,
          codec_type: data.codec_type,
          codec_tag_string: data.codec_tag_string,
          codec_tag: data.codec_tag,
          sample_fmt: data.sample_fmt,
          sample_rate: data.sample_rate,
          channels: data.channels,
          channel_layout: data.channel_layout,
          bits_per_sample: data.bits_per_sample,
          initial_padding: data.initial_padding,
          id: data.id,
          r_frame_rate: data.r_frame_rate,
          avg_frame_rate: data.avg_frame_rate,
          time_base: data.time_base,
          start_pts: data.start_pts,
          start_time: data.start_time,
          duration_ts: data.duration_ts,
          duration: data.duration,
          bit_rate: data.bit_rate,
          max_bit_rate: data.max_bit_rate,
          bits_per_raw_sample: data.bits_per_raw_sample,
          nb_frames: data.nb_frames,
          nb_read_frames: data.nb_read_frames,
          nb_read_packets: data.nb_read_packets,
          extradata_size: data.extradata_size,
        })),
        format: { ...videoMetadata.format },
      },
    };
    return VideoMetadata.create(videoMetadataDocument);
  } catch (error) {
    throw new apiError(
      httpStatus.BAD_REQUEST,
      `Error extracting video metadata: ${error.message}`
    );
  }
};

module.exports = {
  // generator
  createGeneratorVideo,
  getGeneratorVideos,
  getGeneratorVideosById,
  updateGeneratorVideosById,
  deleteGeneratorVideosById,
  // extractor
  createExtractorVideo,
};
