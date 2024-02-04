"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
let bookings = [
  {
    spotId: 2,
    userId: 1,
    startDate: "2024-08-25",
    endDate: "2024-08-29",
  },
  {
    spotId: 3,
    userId: 2,
    startDate: "2024-02-20",
    endDate: "2024-02-21",
  },
  {
    spotId: 1,
    userId: 3,
    startDate: "2024-04-15",
    endDate: "2024-04-18",
  },
];
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
    await Booking.bulkCreate(bookings, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: bookings.map((booking) => booking.id),
      },
      {}
    );
  },
};
