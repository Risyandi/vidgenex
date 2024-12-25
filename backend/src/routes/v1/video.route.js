const express = require("express");
const validate = require("../../middleware/validate");
const router = express.Router();

const { videoValidation } = require("../../utils/validation");
const { videoController } = require("../../controllers");

// generator
router
  .route("/generator")
  .post(validate(videoValidation.createGeneratorVideo), videoController.createGeneratorVideo)
  .get(validate(videoValidation.getGeneratorVideos), videoController.getGeneratorVideos);

router
  .route("/:id")
  .get(validate(videoValidation.getGeneratorVideo), videoController.getGeneratorVideo)
  .patch(validate(videoValidation.updateGeneratorVideo), videoController.updateGeneratorVideo)
  .delete(validate(videoValidation.deleteGeneratorVideo), videoController.deleteGeneratorVideo);

// extractor
router
  .route("/extractor")
  .post(validate(videoValidation.createExtractorVideo), videoController.createExtractorVideo)
  .get(validate(videoValidation.getExtractorVideos), videoController.getExtractorVideos);

router
  .route("/:id")
  .get(validate(videoValidation.getExtractorVideo), videoController.getExtractorVideo)
  .patch(validate(videoValidation.updateExtractorVideo), videoController.updateExtractorVideo)
  .delete(validate(videoValidation.deleteExtractorVideo), videoController.deleteExtractorVideo);

module.exports = router;
