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
  SpotImage,
  ReviewImage,
} = require("../../db/models");
const { check } = require("express-validator");
const spot = require("../../db/models/spot");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// delete a spot image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const ownerId = req.user.id;

  const findReviewImage = await ReviewImage.findAll({
    where: {
      id: imageId,
    },
  });

  const reviewUser = await Review.findAll({
    where: {
      id: findReviewImage.spotId,
    },
  });

  if (ownerId !== reviewUser) {
    return res.status(403).json({
      message: "Review must belong to the current user",
    });
  }

  if (findReviewImage === null) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  } else {
    await findReviewImage.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});

module.exports = router;
