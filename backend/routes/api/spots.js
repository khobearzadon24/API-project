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
// get all spots owned by the current user
router.get("/current", requireAuth, async (req, res) => {
  const ownerId = req.user.id;
  const Spots = await Spot.findAll({
    where: {
      ownerId,
    },
  });
  let avgRating;

  for (let i = 0; i < Spots.length; i++) {
    let numReviews = await Review.count({
      where: {
        spotId: Spots[i].id,
      },
    });
    let stars = await Review.sum("stars", {
      where: {
        spotId: Spots[i].id,
      },
    });

    if (stars === null) avgRating = 0;
    else {
      avgRating = stars / numReviews;
    }

    Spots[i].setDataValue("avgRating", avgRating);

    const imageUrl = await SpotImage.findOne({
      where: {
        spotId: Spots[i].id,
      },
    });

    if (imageUrl === null) {
      Spots[i].setDataValue("previewImage", null);
    } else {
      Spots[i].setDataValue("previewImage", imageUrl.url);
    }
  }
  res.json({ Spots });
});

//get details of a spot from an id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const Spots = await Spot.findByPk(spotId);
  if (Spots === null) {
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
  Spots.setDataValue("numReviews", numReviews);
  Spots.setDataValue("avgRating", avgRating);

  const imageUrl = await SpotImage.findAll({
    where: {
      spotId: spotId,
    },
    attributes: ["id", "url", "preview"],
  });

  if (imageUrl === null) {
    Spots.setDataValue("previewImage", null);
  } else {
    Spots.setDataValue("previewImage", imageUrl);
  }

  const owner = await User.findByPk(Spots.ownerId, {
    attributes: ["id", "firstName", "lastName"],
  });

  Spots.setDataValue("Owner", owner);

  res.json(Spots);
});

//get all the spots
router.get("/", async (req, res) => {
  //   const numReviews = await Review.count({
  //     spot: "spotId",
  //   });

  //   const getAllSpotImages = await SpotImage.findAll({
  //     spot: "spotId",
  //   });

  const Spots = await Spot.findAll();
  let avgRating;

  for (let i = 0; i < Spots.length; i++) {
    let numReviews = await Review.count({
      where: {
        spotId: Spots[i].id,
      },
    });
    let stars = await Review.sum("stars", {
      where: {
        spotId: Spots[i].id,
      },
    });

    if (stars === null) avgRating = 0;
    else {
      avgRating = stars / numReviews;
    }

    Spots[i].setDataValue("avgRating", avgRating);

    const imageUrl = await SpotImage.findOne({
      where: {
        spotId: Spots[i].id,
      },
    });

    if (imageUrl === null) {
      Spots[i].setDataValue("previewImage", null);
    } else {
      Spots[i].setDataValue("previewImage", imageUrl.url);
    }
  }
  res.json({
    Spots,
  });
});

router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country } = req.body;
});

module.exports = router;
