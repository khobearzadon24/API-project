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

// delete a booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  const ownerId = req.user.id;

  const findBooking = Booking.findByPk(bookingId);

  if (ownerId !== findBooking.userId) {
    return res.status(403).json({
      message: "Booking must belong to current user",
    });
  }

  if (!findBooking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  // booking cannot be started
  const currentDate = new Date();
  if (findBooking.startDate < currentDate) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await findBooking.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});
//edit a booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;

  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);

  if (!booking.id) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  const ownerId = req.user.id;

  if (ownerId !== booking.ownerId) {
    res.status(403).json({
      message: "Must be the owner to edit a booking",
    });
  }

  booking.startDate = startDate || booking.startDate;
  booking.endDate = endDate || booking.endDate;

  await booking.save();

  res.json(booking);
});

// //Get all current User's Bookings
// router.get("/current", requireAuth, async (req, res) => {
//   const userId = req.user.id;
//   const bookings = await Booking.findAll({
//     where: {
//       userId: userId,
//     },
//     include: [
//       {
//         model: Spot,
//         attributes: {
//           exclude: ["description", "createdAt", "updatedAt"],
//         },
//       },
//     ],
//   });

//   for (let i = 0; i < bookings.length; i++) {
//     let json = bookings[i].toJSON();
//     // console.log(json)

//     const previewimage = await SpotImage.findOne({
//       where: {
//         spotId: json.Spot.id,
//         preview: true,
//       },
//     });
//     // console.log(previewimage)

//     if (previewimage) {
//       json.Spot.previewImage = previewimage.url;
//     } else {
//       json.Spot.previewImage = null;
//     }

//     bookings[i] = json;
//   }

//   res.json({
//     Bookings: bookings,
//   });
// });

//get all of the current user's bookings
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: {
      userId: userId,
    },
  });

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "description"],
    },
  });

  const spotImage = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: {
      model: SpotImage,
      attributes: ["url"],
    },
  });

  const response = [];

  bookings.forEach((booking) => response.push(booking.toJSON()));

  console.log(spots, "over here!!!!");
  for (let i = 0; i < response.length; i++) {
    let spot = spots[i].toJSON();
    response[i].Spot = spot;
    spot.previewImage = spotImage[i].SpotImages;
  }

  res.json({ Bookings: response });
});

module.exports = router;
