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

router.get("/current", requireAuth, async (req, res) => {
  const ownerId = req.user.id;

  const allBookings = await Booking.findAll({
    where: {
      userId: ownerId,
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  });
  res.json({ Bookings: allBookings });
});

module.exports = router;
