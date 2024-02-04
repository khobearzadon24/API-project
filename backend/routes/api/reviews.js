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

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// add an image to a review based on the review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  const { url } = req.body;

  const findReviewId = await Review.findByPk(reviewId);

  if (findReviewId === null) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  let findAllReviews = await ReviewImage.findAll({
    where: {
      reviewId: reviewId,
    },
  });

  if (findAllReviews.length > 10)
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });

  const ownerId = req.user.id;

  if (ownerId !== findReviewId.userId) {
    res.status(403).json({
      message: "Must be the owner of the review to add an image",
    });
  }

  await ReviewImage.create({ reviewId, url });

  const findReviewImage = await ReviewImage.findAll({
    where: {
      url: url,
      reviewId: reviewId,
    },
    attributes: ["id", "url", "reviewId"],
  });

  res.json(findReviewImage);
});

// edit a review
router.put("/:reviewId", [requireAuth, validateReview], async (req, res) => {
  const { review, stars } = req.body;

  const { reviewId } = req.params;

  const findReview = await Review.findByPk(reviewId);

  if (findReview === null) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId !== findReview.userId) {
    return res.status(403).json({
      message: "Must be the owner of the review",
    });
  }

  findReview.review = review || findReview.review;
  findReview.stars = stars || findReview.stars;

  await findReview.save();

  res.json(findReview);
});

// delete a review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  const findReview = await Review.findByPk(reviewId);

  if (!findReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId !== findReview.userId) {
    return res.status(403).json({
      message: "Must be the owner to delete the review",
    });
  }

  await findReview.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

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

  // console.log(spots[0].name, "OVER HERE");

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
  console.log(spotImage, "OVER HERE");
  for (let i = 0; i < response.length; i++) {
    let spot = spots[i].toJSON();
    response[i].User = user[i];
    response[i].Spot = spot;
    spot.previewImage = spotImage[i].SpotImages[0].url;
    response[i].ReviewImages = reviewImages[i].ReviewImages;
  }

  res.json({ Reviews: response });
});

module.exports = router;
