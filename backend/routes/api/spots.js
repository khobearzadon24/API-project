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
const { check, query } = require("express-validator");
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

const validateDates = [
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((val, { req }) => {
      const currentDate = new Date();
      if (new Date(val) <= currentDate) {
        throw new Error("start date cannot be in the past");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .custom((val, { req }) => {
      const startDate = new Date(req.body.startDate);
      if (new Date(val) <= startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateQueryFilters = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  query("maxLat")
    .optional()
    .isInt({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  query("minLat")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum latitude is invalid"),
  query("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  query("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

//create a booking from a spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateDates,
  async (req, res) => {
    const { startDate, endDate } = req.body;

    const { spotId } = req.params;

    if (!startDate) {
      return res.status(400).json({
        message: "Start date is required",
      });
    }

    if (!endDate) {
      return res.status(400).json({
        message: "End date is required",
      });
    }

    const getSpot = await Spot.findByPk(spotId);

    if (getSpot === null) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const ownerId = req.user.id;

    if (ownerId === getSpot.ownerId) {
      res.status(403).json({
        message: "Users cannot book their own spot.",
      });
    }

    const findBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
    });

    const findOtherBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        [Op.and]: [
          {
            startDate: {
              [Op.lte]: [startDate],
            },
          },
          {
            endDate: {
              [Op.gte]: [endDate],
            },
          },
        ],
      },
    });

    if (findBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (findOtherBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const createBooking = await Booking.create({
      spotId: +spotId,
      userId: ownerId,
      startDate,
      endDate,
    });
    res.status(201).json(createBooking);
  }
);

//get all bookings for a spot based on the spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  // destrucutre spotId

  const spot = await Spot.findByPk(spotId);
  // find spot based on spot id

  // if spot does not exist, then spot couldnt be found
  if (!spot) {
    return res.status(404).json({
      message: `Spot couldn't be found.`,
    });
  }

  const ownerId = req.user.id;
  // get current user

  // if you are the owner of the spot
  if (spot.ownerId === ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
    return res.json({ Bookings: bookings });
  }

  //if you are not the owner of the spot
  if (spot.ownerId !== ownerId) {
    const bookings = await Booking.findAll({
      where: {
        userId: ownerId,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });
    return res.json({ Bookings: bookings });
  }
});

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

  if (review === null) {
    return res.status(400).json({
      message: "Bad Request",
      errors: "Review text is required",
    });
  }

  if (stars === null) {
    return res.status(400).json({
      message: "Bad Request",
      error: "Stars must be an integer from 1 to 5",
    });
  }

  const { spotId } = req.params;

  const getSpot = await Spot.findByPk(spotId);

  if (getSpot === null) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId === getSpot.ownerId) {
    res.status(403).json({
      message: "Users cannot add a review to their own spot.",
    });
  }

  const findReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: ownerId,
    },
  });

  if (!findReview) {
    return res.status(403).json({
      message: "User already has a review for this spot",
    });
  }
  // add in error handler for when review already exists

  const createReview = await Review.create({
    spotId: +spotId,
    userId: ownerId,
    review,
    stars,
  });

  res.status(201).json(createReview);
});

// add an image to a spot based on the spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const { spotId } = req.params;

  const createSpotImage = await Spot.findByPk(spotId);

  const ownerId = req.user.id;

  if (ownerId !== createSpotImage.ownerId) {
    return res.status(403).json({
      message: "Must be the owner to add an image",
    });
  }

  if (!createSpotImage) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  await SpotImage.create({ spotId, url, preview });

  const findSpotImage = await SpotImage.findOne({
    where: {
      url: url,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  res.json(findSpotImage);
});

// get all spots owned by the current user
router.get("/current", requireAuth, async (req, res) => {
  const ownerId = req.user.id;
  const Spots = await Spot.findAll({
    where: {
      ownerId: ownerId,
    },
  });

  const findUser = await User.findOne({
    where: {
      id: ownerId,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      message: "User does not exist",
    });
  }

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
    Spots.setDataValue("SpotImages", null);
  } else {
    Spots.setDataValue("SpotImages", imageUrl);
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

  if (!spot.id) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId !== spot.ownerId) {
    res.status(403).json({
      message: "Must be the owner to edit a spot",
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

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId !== spot.ownerId) {
    return res.status(403).json({
      message: "Must be the owner to delete the spot",
    });
  }

  await spot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

//get all the spots
router.get("/", validateQueryFilters, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const paginationObj = {
    where: {},
  };

  if (!page) page = 1;
  if (!size) size = 1;
  if (page >= 10) page = 10;
  if (size >= 20) size = 20;

  paginationObj.page = size;
  paginationObj.size = size * (page - 1);

  if (parseInt(size) <= 0 || page <= 0) {
    delete paginationObj.page;
    delete paginationObj.size;
  }

  if (minPrice < 0) minPrice = 0;
  if (maxPrice < 0) maxPrice = 0;
  //   minLat,
  if (minLat) {
    paginationObj.where.lat = { [Op.gte]: minLat };
  }
  //   maxLat,
  if (maxLat) {
    paginationObj.where.lat = { [Op.lte]: maxLat };
  }

  if (minLat && maxLat) {
    paginationObj.where.lat = { [Op.between]: [minLat, maxLat] };
  }
  //   minLng,
  if (minLng) {
    paginationObj.where.lng = { [Op.gte]: minLng };
  }
  //   maxLng,
  if (maxLng) {
    paginationObj.where.lng = { [Op.lte]: maxLng };
  }

  if (minLng && maxLng) {
    paginationObj.where.lng = { [Op.between]: [minLng, maxLng] };
  }
  //   minPrice,
  if (minPrice) {
    paginationObj.where.price = { [Op.gte]: minPrice };
  }
  //   maxPrice,
  if (maxPrice) {
    paginationObj.where.price = { [Op.lte]: maxPrice };
  }
  if (minPrice && maxPrice) {
    paginationObj.where.price = { [Op.between]: [minPrice, maxPrice] };
  }

  const Spots = await Spot.findAll({});
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
    page: parseInt(page),
    size: parseInt(size),
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

  return res.status(201).json(spot);
});

module.exports = router;
