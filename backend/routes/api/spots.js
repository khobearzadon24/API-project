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
} = require("../../db/models");
const { check } = require("express-validator");
const spot = require("../../db/models/spot");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validatePost = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .notEmpty()
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isString() // add to all the strings!!!
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0.01 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

// get all reviews by a spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: `Spot couldn't be found.`,
    });
  }

  const allReviews = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  res.json({ Reviews: allReviews });
});

// create a review for a spot based on the spot's id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { review, stars } = req.body;

  const { spotId } = req.params;

  const getSpot = await Spot.findByPk(spotId);

  const ownerId = req.user.id;

  if (ownerId === getSpot.ownerId) {
    res.status(403).json({
      message: "Users cannot add a review to their own spot.",
    });
  }

  if (!getSpot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const createReview = await Review.create({
    spotId: +spotId,
    userId: ownerId,
    review,
    stars,
  });

  res.json(createReview);
});

// add an image to a spot based on the spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const { spotId } = req.params;

  const createSpotImage = await Spot.findByPk(spotId);

  const ownerId = req.user.id;

  if (ownerId !== createSpotImage.ownerId) {
    res.status(403).json({
      message: "Must be the owner to add an image",
    });
  }

  if (!createSpotImage) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const spotImage = await SpotImage.create({ spotId, url, preview });

  // await spotImage.save();

  res.json(spotImage);
});

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

//edit a spot
router.put("/:spotId", requireAuth, validatePost, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  const ownerId = req.user.id;

  if (ownerId !== spot.ownerId) {
    res.status(403).json({
      message: "Must be the owner to edit an spot",
    });
  }

  spot.address = address || spot.address;
  spot.city = city || spot.city;
  spot.state = state || spot.state;
  spot.country = country || spot.country;
  spot.lat = lat || spot.lat;
  spot.lng = lng || spot.lng;
  spot.name = name || spot.name;
  spot.description = description || spot.description;
  spot.price = price || spot.price;

  await spot.save();

  res.json(spot);
});

//delete a post
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  const ownerId = req.user.id;

  if (ownerId !== spot.ownerId) {
    res.status(403).json({
      message: "Must be the owner to delete an spot",
    });
  }

  if (spot === null) {
    res.json({
      message: "Spot couldn't be found",
    });
  } else {
    await spot.destroy();
    res.json({
      message: "Successfully deleted",
    });
  }
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

//create a spot
router.post("/", requireAuth, validatePost, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id;

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(spot);
});

module.exports = router;
