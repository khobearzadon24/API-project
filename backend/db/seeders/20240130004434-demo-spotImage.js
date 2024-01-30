"use strict";

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

let spotImages = [
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
    await SpotImage.bulkCreate(spotImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete(
      options,
      {
        id: spotImages.map((spotImage) => spotImage.id),
      },
      {}
    );
  },
};
