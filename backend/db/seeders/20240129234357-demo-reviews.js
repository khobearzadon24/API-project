"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

let reviews = [
  {
    spotId: 2,
    userId: 1,
    review: "The place was nice.",
    stars: 3,
  },
  {
    spotId: 3,
    userId: 2,
    review: "The place was comfortable",
    stars: 4,
  },
  {
    spotId: 1,
    userId: 3,
    review: "The place had lots of natural lighting",
    stars: 5,
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
    await Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: reviews.map((review) => review.id),
      },
      {}
    );
  },
};
