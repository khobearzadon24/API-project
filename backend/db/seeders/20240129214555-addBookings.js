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
    userId: 2,
    startDate: "8-25-2024",
    endDate: "8-29-2024",
  },
  {
    spotId: 2,
    userId: 2,
    startDate: "2-20-24",
    endDate: "2-21-24",
  },
  {
    spotId: 2,
    userId: 2,
    startDate: "4-15-24",
    endDate: "4-18-24",
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
