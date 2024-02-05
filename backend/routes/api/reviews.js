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

  if (!findReviewId) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  console.log(findReviewId, "OVER HERE");

  const ownerId = req.user.id;

  if (ownerId !== findReviewId.userId) {
    res.status(403).json({
      message: "Forbidden",
    });
  }

  let findAllReviews = await ReviewImage.findAll({
    where: {
      reviewId: reviewId,
    },
  });

  if (findAllReviews.length >= 10)
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });

  const getImage = await ReviewImage.create({ reviewId, url });

  // const findReviewImage = await ReviewImage.findAll({
  //   where: {
  //     url: url,
  //     reviewId: reviewId,
  //   },
  //   attributes: ["id", "url", "reviewId"],
  // });

  res.json({
    id: getImage.id,
    url: getImage.url,
  });
});

// edit a review
router.put("/:reviewId", [requireAuth, validateReview], async (req, res) => {
  const { review, stars } = req.body;

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
      message: "Forbidden",
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
      message: "Forbidden",
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
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["createdAt", "updatedAt", "description"],
        },
        include: {
          model: SpotImage,
          where: {
            preview: true,
          },
          attributes: ["url"],
        },
      },
      {
        model: ReviewImage,
        attributes: [["reviewId", "id"], "url"],
      },
    ],
  });

  for (let i = 0; i < reviews.length; i++) {
    let response = reviews[i].toJSON();
    let spotURL = response.Spot.SpotImages[0];

    if (spotURL) {
      response.Spot.previewImage = spotURL.url;
    } else {
      response.Spot.previewImage = null;
    }
    if (response.Spot.lat) {
      response.Spot.lat = parseFloat(response.Spot.lat);
    }
    if (response.Spot.lng) {
      response.Spot.lng = parseFloat(response.Spot.lng);
    }
    if (response.Spot.price) {
      response.Spot.price = parseFloat(response.Spot.price);
    }
    //deletes url
    delete response.Spot.SpotImages;
    reviews[i] = response;
  }

  res.json({ Reviews: reviews });
});

module.exports = router;
