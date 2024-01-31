const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Review, User, Spot, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// get all reviews of the current user
router.get("/current", async (req, res) => {
  const userId = req.user.id;
  const Reviews = await Review.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: User,
        where: {
          id: userId,
        },
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        where: {
          reviewId: userId,
        },
        attributes: ["id", "url"],
      },
    ],
  });
  // const user = await User.findOne({
  //   where: {
  //     id: userId,
  //   },
  //   attributes: ["id", "firstName", "lastName"],
  // });

  // const spot = await Spot.findByPk(userId, {
  //   attributes: [
  //     "id",
  //     "ownerId",
  //     "address",
  //     "city",
  //     "state",
  //     "country",
  //     "lat",
  //     "lng",
  //     "name",
  //     "price",
  //     "previewImage",
  //   ],
  // });

  // const reviewImage = await ReviewImage.findByPk(userId, {
  //   attributes: ["id", "url"],
  // });
  // if (user === null) {
  //   Reviews.setDataValue("User", null);
  // } else {
  //   Reviews.setDataValue("User", user);
  // }
  res.json({ Reviews });
});

module.exports = router;
