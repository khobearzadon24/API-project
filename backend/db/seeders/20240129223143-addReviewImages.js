"use strict";

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
let reviewImages = [
  {
    reviewId: 1,
    url: 2,
  },
  {
    reviewId: 2,
    url: 2,
  },
  {
    reviewId: 3,
    url: 2,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
