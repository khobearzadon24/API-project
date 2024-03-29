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

  const findBooking = await Booking.findOne({
    where: {
      id: bookingId,
    },
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
  });

  if (!findBooking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  if (ownerId !== findBooking.userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const currentDate = new Date();
  if (new Date(findBooking.startDate) <= currentDate) {
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
  const { user } = req;
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  // const bookings = await Booking.findOne({
  //   where: {
  //     id: bookingId,
  //   },
  //   attributes: [
  //     "id",
  //     "spotId",
  //     "userId",
  //     "startDate",
  //     "endDate",
  //     "createdAt",
  //     "updatedAt",
  //   ],
  // });

  const bookings = await Booking.findByPk(bookingId);

  // if it doesnt exist
  if (!bookings) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  let currentDate = new Date();
  if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  //if startdate is less than current date
  if (new Date(startDate) < currentDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
      },
    });
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }
  // find existing booking in Booking model
  const existBooking = await Booking.findOne({
    where: {
      id: {
        [Op.ne]: bookingId,
      },
      spotId: bookings.spotId,
      [Op.and]: [
        {
          startDate: {
            [Op.lte]: new Date(endDate),
          },
        },
        {
          endDate: {
            [Op.gte]: new Date(startDate),
          },
        },
      ],
    },
  });

  // const existingOtherBooking = await Booking.findOne({
  //   where: {
  //     spotId: bookings.spotId,
  //     [Op.or]: [
  //       {
  //         startDate: { [Op.between]: [startDate, endDate] },
  //       },
  //       {
  //         endDate: { [Op.between]: [startDate, endDate] },
  //       },
  //       {
  //         [Op.and]: [
  //           { startDate: { [Op.lte]: startDate } },
  //           { endDate: { [Op.gte]: endDate } },
  //         ],
  //       },
  //     ],
  //   },
  // });
  // if (existingOtherBooking) {
  //   return res.status(403).json({
  //     message: "Sorry, this spot is already booked for the specified dates",
  //     errors: {
  //       startDate: "Start date conflicts with an existing booking",
  //       endDate: "End date conflicts with an existing booking",
  //     },
  //   });
  // }

  if (existBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  if (user.id !== bookings.userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  bookings.startDate = startDate;
  bookings.endDate = endDate;

  await bookings.save();

  res.json({
    id: req.params.bookingId,
    spotId: bookings.spotId,
    userId: bookings.userId,
    startDate: bookings.startDate,
    endDate: bookings.endDate,
    createdAt: bookings.createdAt,
    updatedAt: bookings.updatedAt,
  });
});
// router.put("/:bookingId", requireAuth, async (req, res) => {
//   const { startDate, endDate } = req.body;

//   const { bookingId } = req.params;

//   const booking = await Booking.findByPk(bookingId);
//   if (!booking) {
//     return res.status(404).json({
//       message: "Booking couldn't be found",
//     });
//   }

//   const ownerId = req.user.id;

//

//   if (ownerId !== booking.userId) {
//     return res.status(403).json({
//       message: "Forbidden",
//     });
//   }

//   let currentDate = new Date();

//   if (new Date(startDate) < currentDate) {
//     return res.status(400).json({
//       message: "Bad Request",
//       errors: {
//         startDate: "startDate cannot be in the past",
//       },
//     });
//   }
//   if (new Date(endDate) <= new Date(startDate)) {
//     return res.status(400).json({
//       message: "Bad Request",
//       errors: {
//         endDate: "endDate cannot be on or before startDate",
//       },
//     });
//   }

//   if (new Date(endDate) < currentDate) {
//     return res.status(403).json({
//       message: "Past bookings can't be modified",
//     });
//   }

//   const existBooking = await Booking.findOne({
//     where: {
//       id: {
//         [Op.ne]: bookingId,
//       },
//       spotId: booking.spotId,
//       [Op.or]: [
//         {
//           startDate: {
//             [Op.between]: [startDate, endDate],
//           },
//         },
//         {
//           endDate: {
//             [Op.between]: [startDate, endDate],
//           },
//         },
//       ],
//     },
//   });

//   const existOtherBooking = await Booking.findOne({
//     where: {
//       id: {
//         [Op.ne]: bookingId,
//       },
//       spotId: booking.spotId,
//       [Op.and]: [
//         {
//           startDate: {
//             [Op.lte]: [startDate],
//           },
//         },
//         {
//           endDate: {
//             [Op.gte]: [endDate],
//           },
//         },
//       ],
//     },
//   });

//   if (existBooking) {
//     return res.status(403).json({
//       message: "Sorry, this spot is already booked for the specified dates",
//       errors: {
//         startDate: "Start date conflicts with an existing booking",
//         endDate: "End date conflicts with an existing booking",
//       },
//     });
//   }

//   if (existOtherBooking) {
//     return res.status(403).json({
//       message: "Sorry, this spot is already booked for the specified dates",
//       errors: {
//         startDate: "Start date conflicts with an existing booking",
//         endDate: "End date conflicts with an existing booking",
//       },
//     });
//   }

//   booking.startDate = startDate || booking.startDate;
//   booking.endDate = endDate || booking.endDate;

//   await booking.save();

//   res.json(booking);
// });

//Get all current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const bookings = await Booking.findAll({
    where: {
      userId: userId,
    },
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  for (let i = 0; i < bookings.length; i++) {
    let booking = bookings[i].toJSON();

    const previewimage = await SpotImage.findOne({
      where: {
        spotId: booking.Spot.id,
        preview: true,
      },
    });

    if (previewimage) {
      booking.Spot.previewImage = previewimage.url;
    } else {
      booking.Spot.previewImage = null;
    }

    bookings[i] = booking;
  }

  res.json({
    Bookings: bookings,
  });
});

module.exports = router;
