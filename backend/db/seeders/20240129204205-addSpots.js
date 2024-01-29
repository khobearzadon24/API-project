"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

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
    try {
      await Spot.bulkCreate(
        [
          // Your code here
          {
            ownerId: 1,
            address: "24 Golden Lane",
            city: "San Francisco",
            state: "California",
            country: "United States",
            lat: 35.4567,
            lng: -100.4386,
            name: "Cool Mansion",
            description: "Nice mansion with an indoor pool.",
            price: 200.99,
          },
          {
            ownerId: 2,
            address: "231 Birchwood Drive",
            city: "Toronto",
            state: "Ontario",
            country: "Canada",
            lat: 80.4892,
            lng: 22.5498,
            name: "Modern Loft",
            description: "Loft with a view of the skyline.",
            price: 85.99,
          },
          {
            ownerId: 3,
            address: "5690 Blackrock St",
            city: "Tampa",
            state: "Florida",
            country: "United States",
            lat: 43.6753,
            lng: -76.3287,
            name: "Fancy House",
            description: "House with three bedrooms and 2 baths.",
            price: 99.99,
          },
        ],
        {
          validate: true,
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
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
        name: { [Op.in]: ["Cool Mansion", "Modern Loft", "Fancy House"] },
      },
      {}
    );
  },
};
