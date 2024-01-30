const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, SpotImage, Review } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// make sure user is logged in to view the spots
// const validateLogin = [
//   check("credential")
//     .exists({ checkFalsy: true })
//     .notEmpty()
//     .withMessage("Please provide a valid email or username."),
//   check("password")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide a password."),
//   handleValidationErrors,
// ];

//get all the spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  const preview = await SpotImage.findAll({
    where: {
      spotId: allSpots.id,
    },
  });

  const reviews = await Review.findAll({
    where: {
      spotId: allSpots.id,
    },
  });
  //calculate the total amount of reviews
  const reviewCount = reviews.length;

  //calculate the total review number
  let reviewTotalAmount = 0;
  reviews.forEach((review) => {
    reviewTotalAmount += review.stars;
  });

  const reviewAvg = Math.round(reviewTotalAmount / reviewCount);

  const payload = {
    id: allSpots.id,
    ownerId: allSpots.ownerId,
    address: allSpots.address,
    city: allSpots.city,
    country: allSpots.country,
    lat: allSpots.lat,
    lng: allSpots.lng,
    name: allSpots.name,
    description: allSpots.description,
    price: allSpots.price,
    createdAt: allSpots.createdAt,
    updatedAt: allSpots.createdAt,
    avgRating: reviewAvg,
    previewImage: preview.url,
  };
  res.json(payload);
});

module.exports = router;
