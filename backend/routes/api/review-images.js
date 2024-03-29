const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const {
  Spot,
  SpotImage,
  Review,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const spot = require("../../db/models/spot");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// delete a review image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const ownerId = req.user.id;

  const findReviewImage = await ReviewImage.findByPk(imageId);

  if (!findReviewImage) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }

  const review = await Review.findByPk(findReviewImage.reviewId);

  if (ownerId !== review.userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await findReviewImage.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
