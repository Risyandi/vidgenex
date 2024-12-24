const express = require("express");
const validate = require("../../middleware/validate");
const router = express.Router();

const { videoValidation } = require("../../utils/validation");
const { videoController } = require("../../controllers");

// generator
router
  .route("/generator")
  .post(validate(videoValidation.createVideo), videoController.createVideo)
  .get(validate(videoValidation.getVideos), videoController.getVideos);

router
  .route("/:id")
  .get(validate(videoValidation.getVideo), videoController.getVideo)
  .patch(validate(videoValidation.updateVideo), videoController.updateVideo)
  .delete(validate(videoValidation.deleteVideo), videoController.deleteVideo);

// extractor
router
  .route("/extractor")
  .post(validate(videoValidation.createVideo), videoController.createVideo)
  .get(validate(videoValidation.getVideos), videoController.getVideos);

router
  .route("/:id")
  .get(validate(videoValidation.getVideo), videoController.getVideo)
  .patch(validate(videoValidation.updateVideo), videoController.updateVideo)
  .delete(validate(videoValidation.deleteVideo), videoController.deleteVideo);

module.exports = router;
