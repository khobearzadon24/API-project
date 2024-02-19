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
          url: "https://static.wikia.nocookie.net/spongefan/images/e/e1/SpongeBob_house.jpg/revision/latest?cb=20180210163257",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://static.wikia.nocookie.net/spongebob/images/f/f0/Patrick%27s_house.png/revision/latest?cb=20230625045626",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://static.wikia.nocookie.net/spongebobgalaxy/images/2/23/Squidwards_House.png/revision/latest/scale-to-width-down/700?cb=20180707172828",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://static.wikia.nocookie.net/theadventuresofgarythesnail/images/5/5b/The_Treedome-0.jpg/revision/latest?cb=20150309183942",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://www.wikihow.com/images/a/a7/Draw-the-Krusty-Krab-Step-34.jpg",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://static.wikia.nocookie.net/cartoons/images/0/09/The_Chum_Bucket.png/revision/latest?cb=20230225012708",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://static.wikia.nocookie.net/spongebob/images/3/38/Handemonium_001.png/revision/latest?cb=20191122235153",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://cdn.staticneo.com/w/spongebob/Mrs._Puff%27s_Boating_School.jpg",
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
