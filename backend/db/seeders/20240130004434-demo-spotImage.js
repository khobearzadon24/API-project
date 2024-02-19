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
          url: "https://i.postimg.cc/7YkQfmyd/Sponge-Bob-house.webp",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/QdPQWdTC/Patrick-s-house.webp",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/8CM6JBGX/Squidwards-House.webp",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/NfbqtWrp/The-Treedome-0.webp",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/3rnnx7n4/Draw-the-Krusty-Krab-Step-34.jpg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/B6Ncbcc9/The-Chum-Bucket.webp",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/GpLQkm31/larrythe-Lobster-001.webp",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/c4ctfMvr/Mrs-Puff-s-Boating-School.jpg",
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
