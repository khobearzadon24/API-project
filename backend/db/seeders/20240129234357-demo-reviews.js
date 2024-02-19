"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

// let reviews = [
//   {
//     spotId: 2,
//     userId: 1,
//     review: "The place was nice.",
//     stars: 3,
//   },
//   {
//     spotId: 3,
//     userId: 2,
//     review: "The place was comfortable",
//     stars: 4,
//   },
//   {
//     spotId: 1,
//     userId: 3,
//     review: "The place had lots of natural lighting",
//     stars: 5,
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
    await Review.bulkCreate(
      [
        {
          spotId: 2,
          userId: 1,
          review: "The place was very sandy and rocky.",
          stars: 3,
        },
        {
          spotId: 3,
          userId: 2,
          review: "The place was dark and scary",
          stars: 2,
        },
        {
          spotId: 4,
          userId: 3,
          review: "The place was very big and I saw many fish",
          stars: 5,
        },
        {
          spotId: 5,
          userId: 4,
          review: "The place had very good burgers",
          stars: 4,
        },
        {
          spotId: 6,
          userId: 5,
          review: "It was very cold and they had horrible food",
          stars: 1,
        },
        {
          spotId: 7,
          userId: 6,
          review: "Not a big fan of working out, but it was nice",
          stars: 3,
        },
        {
          spotId: 8,
          userId: 7,
          review: "I hate school and I would never stay here again",
          stars: 1,
        },
        {
          spotId: 1,
          userId: 8,
          review: "It smelled like pineapples and they had a pet snail",
          stars: 5,
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
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
