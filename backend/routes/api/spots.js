const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");

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

//get details of a spot from an id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const spotDetail = await Spot.findByPk(spotId);
  if (spotDetail === null) {
    return res.status(404).json({
      message: `Spot couldn't be found.`,
    });
  }

  let avgRating;

  let numReviews = await Review.count({
    where: {
      spotId: spotId,
    },
  });
  let stars = await Review.sum("stars", {
    where: {
      spotId: spotId,
    },
  });

  if (stars === null) avgRating = 0;
  else {
    avgRating = stars / numReviews;
  }
  spotDetail.setDataValue("numReviews", numReviews);
  spotDetail.setDataValue("avgRating", avgRating);

  const imageUrl = await SpotImage.findAll({
    where: {
      spotId: spotId,
    },
    attributes: ["id", "url", "preview"],
  });

  if (imageUrl === null) {
    spotDetail.setDataValue("previewImage", null);
  } else {
    spotDetail.setDataValue("previewImage", imageUrl);
  }

  const owner = await User.findByPk(spotDetail.ownerId, {
    attributes: ["id", "firstName", "lastName"],
  });

  spotDetail.setDataValue("Owner", owner);

  res.json(spotDetail);
});

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

router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country } = req.body;
});

module.exports = router;
