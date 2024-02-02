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

// delete a spot image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const ownerId = req.user.id;

  const findSpotImage = await SpotImage.findAll({
    where: {
      id: imageId,
    },
  });

  const spotUser = await Spot.findAll({
    where: {
      id: findSpotImage.spotId,
    },
  });

  if (ownerId !== spotUser) {
    return res.status(403).json({
      message: "Spot must belong to the current user",
    });
  }

  if (findSpotImage === null) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  } else {
    await findSpotImage.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});

module.exports = router;
