const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { toJSON, paginate } = require("./plugins");

const videoThumbnailSchema = Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailPath: {
      type: String,
    },
    videoPath: {
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
videoThumbnailSchema.plugin(toJSON);
videoThumbnailSchema.plugin(paginate);

// full text search
videoThumbnailSchema.index({ "$**": "text" });

videoThumbnailSchema.statics.isVideoTaken = async function (
  videoUrl,
  excludeVideoId
) {
  const videoFind = await this.findOne({
    videoUrl,
    _id: { $ne: excludeVideoId },
  });
  return !!videoFind;
};

/**
 * @typedef VideoThumbnail
 */
const VideoThumbnail = model("Video-Thumbnail", videoThumbnailSchema);

module.exports = VideoThumbnail;
