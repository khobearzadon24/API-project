"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
// let bookings = [
//   {
//     spotId: 2,
//     userId: 1,
//     startDate: "2024-08-25",
//     endDate: "2024-08-29",
//   },
//   {
//     spotId: 3,
//     userId: 2,
//     startDate: "2024-02-20",
//     endDate: "2024-02-21",
//   },
//   {
//     spotId: 1,
//     userId: 3,
//     startDate: "2024-04-15",
//     endDate: "2024-04-18",
//   },
// ];
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // await Booking.bulkCreate(bookings, { validate: true });
    await Booking.bulkCreate(
      [
        {
          spotId: 2,
          userId: 1,
          startDate: "2024-04-24",
          endDate: "2024-04-25",
        },
        {
          spotId: 3,
          userId: 2,
          startDate: "2024-02-15",
          endDate: "2024-02-17",
        },
        {
          spotId: 4,
          userId: 3,
          startDate: "2024-05-14",
          endDate: "2024-05-18",
        },
        {
          spotId: 5,
          userId: 4,
          startDate: "2024-07-12",
          endDate: "2024-07-14",
        },
        {
          spotId: 6,
          userId: 5,
          startDate: "2024-08-10",
          endDate: "2024-08-12",
        },
        {
          spotId: 7,
          userId: 6,
          startDate: "2024-09-10",
          endDate: "2024-09-11",
        },
        {
          spotId: 8,
          userId: 7,
          startDate: "2024-04-10",
          endDate: "2024-04-11",
        },
        {
          spotId: 1,
          userId: 8,
          startDate: "2024-03-19",
          endDate: "2024-09-22",
        },
      ],
      options,
      { validate: true }
    );
  },
  // },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] },
      },
      {}
    );
  },
};
