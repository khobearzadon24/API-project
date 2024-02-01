const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");

const router = express.Router();

// get all reviews of the current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: {
      userId: userId,
    },
  });

  const user = await User.findAll({
    where: {
      id: userId,
    },
    attributes: ["id", "firstName", "lastName"],
  });

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "description"],
    },
  });

  const spotImage = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: {
      model: SpotImage,
      attributes: ["url"],
    },
  });

  const reviewImages = await Review.findAll({
    where: {
      userId: userId,
    },
    include: {
      model: ReviewImage,
      attributes: [["reviewId", "id"], "url"],
    },
  });

  const response = [];

  reviews.forEach((review) => response.push(review.toJSON()));

  for (let i = 0; i < response.length; i++) {
    let spot = spots[i].toJSON();
    response[i].User = user[i];
    response[i].Spot = spot;
    spot.previewImage = spotImage[i].SpotImages;
    response[i].ReviewImages = reviewImages[i].ReviewImages;
  }

  res.json({ Reviews: response });
});

module.exports = router;
