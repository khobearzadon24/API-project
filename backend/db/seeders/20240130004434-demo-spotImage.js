"use strict";

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

// let spotImages = [
//   {
//     spotId: 1,
//     url: "exampleURL",
//     preview: true,
//   },
//   {
//     spotId: 2,
//     url: "anotherURL",
//     preview: false,
//   },
//   {
//     spotId: 3,
//     url: "extraURL",
//     preview: true,
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
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "exampleURL",
          preview: true,
        },
        {
          spotId: 2,
          url: "anotherURL",
          preview: false,
        },
        {
          spotId: 3,
          url: "extraURL",
          preview: true,
        },
        {
          spotId: 4,
          url: "underwaterURL",
          preview: true,
        },
        {
          spotId: 5,
          url: "burgerURL",
          preview: false,
        },
        {
          spotId: 6,
          url: "chumURL",
          preview: true,
        },
        {
          spotId: 7,
          url: "muscleURL",
          preview: true,
        },
        {
          spotId: 8,
          url: "drivingURL",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
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
