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
          spotId: 1,
          url: "https://i.postimg.cc/sX2Wh7ft/spongelivingroom.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/xCKCxPjk/spongekitchen.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/MZ1wBTXG/spongebedroom.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/BbmMFHKy/spongelibrary.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/QdPQWdTC/Patrick-s-house.webp",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/PJfNc8Rd/Patrick-in-his-chair.avif",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/dVccVKJy/patrickinhisbed.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/cCQyQDmH/patricksrock.webp",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/Cx5r0Pqq/patrickopenspace.webp",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/8CM6JBGX/Squidwards-House.webp",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/Z5DNkj80/squidkitchen.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/zv0BCXp3/squidlivingroom.webp",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/dt3tMF4m/squidbathroom.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/jSNTKSNN/squidwindow.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/NfbqtWrp/The-Treedome-0.webp",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/QNRLxWDt/sandybedroom.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/HLj3yB4C/sandywinter.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/05GGrTRw/sandyfrontdoor.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/RhPNKQLj/sandyscrib.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/3rnnx7n4/Draw-the-Krusty-Krab-Step-34.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/ZRBFK1w2/krabcashier.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/FRpmzB1b/krabkitchen.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/TwwNj7CJ/kraboffice.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/pV78LG8M/krabentrance.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/B6Ncbcc9/The-Chum-Bucket.webp",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/sxc0rk6S/chumsitting.jpg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/tJkVpjKh/chumlab.jpg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/8kYSX3J3/chumkitchen.webp",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/L6VrKbn2/chumstove.jpg",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/GpLQkm31/larrythe-Lobster-001.webp",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/2SZhLPhf/larrybench.jpg",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/X7wyVwbV/larryarea.jpg",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/3NQJ6cW2/larrydesk.jpg",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/vTYCcrNp/larryoverview.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/c4ctfMvr/Mrs-Puff-s-Boating-School.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/5NjkT2dq/puffclassroom.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/25YGkzJt/pufflockers.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/q7gsMzwj/pufffront.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/K88LJR6x/puffclass.jpg",
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
