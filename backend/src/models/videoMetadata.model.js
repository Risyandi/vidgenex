const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { toJSON, paginate } = require("./plugins");

const videoMetadataSchema = Schema(
  {
    duration: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
    },
    codec: {
      type: String,
    },
    bitrate: {
      type: String,
    },
    framerate: {
      type: String,
    },
    deletedBy: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedBy: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
videoMetadataSchema.plugin(toJSON);
videoMetadataSchema.plugin(paginate);

// full text search
videoMetadataSchema.index({ "$**": "text" });

videoMetadataSchema.statics.isMetadataTaken = async function (
  metaData,
  excludeVideoId
) {
  const metadataFind = await this.findOne({
    metaData,
    _id: { $ne: excludeVideoId },
  });
  return !!metadataFind;
};

/**
 * @typedef VideoThumbnail
 */
const VideoMetadata = model("Video-Metadata", videoMetadataSchema);

module.exports = VideoMetadata;
