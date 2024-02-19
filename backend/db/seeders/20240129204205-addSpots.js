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
            name: "Cool Pineapple",
            description: "Nice pinapple house with a big library.",
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
            name: "Modern Rock",
            description: "Rock with sanded floors.",
            price: 55.99,
          },
          {
            ownerId: 3,
            address: "5690 Blackrock St",
            city: "Tampa",
            state: "Florida",
            country: "United States",
            lat: 43.6753,
            lng: -76.3287,
            name: "Fancy Squid House",
            description: "House with three bedrooms and 2 baths.",
            price: 79.99,
          },
          {
            ownerId: 4,
            address: "359 Underwater St",
            city: "Austin",
            state: "Texas",
            country: "United States",
            lat: 83.6758,
            lng: -70.3287,
            name: "Underwater Dome",
            description: "House that is underwater",
            price: 199.99,
          },
          {
            ownerId: 5,
            address: "745 Anchor St",
            city: "Sacramento",
            state: "California",
            country: "United States",
            lat: 79.6753,
            lng: -35.3287,
            name: "Krusty Crabs",
            description: "House with 2 bedrooms and 1 bath.",
            price: 230.99,
          },
          {
            ownerId: 6,
            address: "543 Takeover St",
            city: "Seattle",
            state: "Washington",
            country: "United States",
            lat: 40.6749,
            lng: -72.3184,
            name: "Chum Bucket",
            description: "House with 2 bedrooms and 2 baths.",
            price: 49.99,
          },
          {
            ownerId: 7,
            address: "167 Muscle St",
            city: "Eugene",
            state: "Oregon",
            country: "United States",
            lat: 49.6741,
            lng: -99.3386,
            name: "Muscle House",
            description: "House with 1 bedrooms and lots of weights.",
            price: 69.99,
          },
          {
            ownerId: 8,
            address: "743 Driving St",
            city: "Hayward",
            state: "California",
            country: "United States",
            lat: 19.6538,
            lng: -81.1234,
            name: "Driving School",
            description: "House with 30 bedrooms and lots of lockers.",
            price: 269.99,
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Cool Pineapple",
            "Modern Rock",
            "Fancy Squid House",
            "Underwater Dome",
            "Krusty Crabs",
            "Chum Bucket",
            "Muscle House",
            "Driving School",
          ],
        },
      },
      {}
    );
  },
};
