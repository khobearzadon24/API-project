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
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");

const router = express.Router();

const validateDates = [
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((val, { req }) => {
      const currentDate = new Date();
      if (new Date(val) <= currentDate) {
        throw new Error("Start date cannot be in the past");
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

router.get("/current", requireAuth, async (req, res) => {
  const ownerId = req.user.id;

  const allBookings = await Booking.findAll({
    where: {
      userId: ownerId,
    },
  });
  const Spots = await Spot.findAll({
    where: {
      ownerId,
    },
  });

  for (let i = 0; i < Spots.length; i++) {
    const imageUrl = await SpotImage.findAll({
      where: {
        spotId: Spots[i].id,
      },
    });

    if (imageUrl === null) {
      Spots[i].setDataValue("previewImage", null);
    } else {
      Spots[i].setDataValue("previewImage", imageUrl.url);
    }
    allBookings[i].setDataValue("Spot", Spots);
  }
  res.json({ Bookings: allBookings });
});

module.exports = router;
