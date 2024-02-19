"use strict";

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
// let reviewImages = [
//   {
//     reviewId: 1,
//     url: "url1",
//   },
//   {
//     reviewId: 2,
//     url: "url2",
//   },
//   {
//     reviewId: 3,
//     url: "url3",
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
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "url1",
        },
        {
          reviewId: 2,
          url: "url2",
        },
        {
          reviewId: 3,
          url: "url3",
        },
        {
          reviewId: 4,
          url: "url4",
        },
        {
          reviewId: 5,
          url: "url5",
        },
        {
          reviewId: 6,
          url: "url6",
        },
        {
          reviewId: 7,
          url: "url7",
        },
        {
          reviewId: 8,
          url: "url8",
        },
      ],
      options,
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
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] },
      },
      {}
    );
  },
};
