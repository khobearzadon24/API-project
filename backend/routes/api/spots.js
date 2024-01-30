const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
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
  //   const numReviews = await Review.count({
  //     spot: "spotId",
  //   });

  //   const getAllSpotImages = await SpotImage.findAll({
  //     spot: "spotId",
  //   });

  const getAllSpots = await Spot.findAll();

  let avgRating;

  for (let i = 0; i < getAllSpots.length; i++) {
    let numReviews = await Review.count({
      where: {
        spotId: getAllSpots[i].id,
      },
    });
    let stars = await Review.sum("stars", {
      where: {
        spotId: getAllSpots[i].id,
      },
    });

    if (stars === null) avgRating = 0;
    else {
      avgRating = stars / numReviews;
    }

    getAllSpots[i].setDataValue("avgRating", avgRating);

    const imageUrl = await SpotImage.findOne({
      where: {
        spotId: getAllSpots[i].id,
      },
    });

    if (imageUrl === null) {
      getAllSpots[i].setDataValue("previewImage", null);
    } else {
      getAllSpots[i].setDataValue("previewImage", imageUrl.url);
    }
  }
  res.json(getAllSpots);
});

router.get("/current", requireAuth, async (req, res) => {
  const ownerId = req.user.id;
  const getAllSpotsByOwner = await Spot.findAll({
    where: {
      ownerId,
    },
  });
  let avgRating;

  for (let i = 0; i < getAllSpotsByOwner.length; i++) {
    let numReviews = await Review.count({
      where: {
        spotId: getAllSpotsByOwner[i].id,
      },
    });
    let stars = await Review.sum("stars", {
      where: {
        spotId: getAllSpotsByOwner[i].id,
      },
    });

    if (stars === null) avgRating = 0;
    else {
      avgRating = stars / numReviews;
    }

    getAllSpotsByOwner[i].setDataValue("avgRating", avgRating);

    const imageUrl = await SpotImage.findOne({
      where: {
        spotId: getAllSpotsByOwner[i].id,
      },
    });

    if (imageUrl === null) {
      getAllSpotsByOwner[i].setDataValue("previewImage", null);
    } else {
      getAllSpotsByOwner[i].setDataValue("previewImage", imageUrl.url);
    }
  }
  res.json(getAllSpotsByOwner);
});

module.exports = router;
