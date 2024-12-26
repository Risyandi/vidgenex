const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { toJSON, paginate } = require("./plugins");

const detailMetadataVideoSchema = new Schema(
  {
    streams: {
      type: [],
      default: [],
    },
    format: {
      type: {},
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const videoMetadataSchema = Schema(
  {
    videoPath: {
      type: String,
    },
    metadata: {
      type: detailMetadataVideoSchema,
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

/**
 * @typedef VideoMetadata
 */
const VideoMetadata = model("Video-Metadata", videoMetadataSchema);

module.exports = VideoMetadata;
