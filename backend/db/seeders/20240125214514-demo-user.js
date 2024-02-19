"use strict";

/** @type {import('sequelize-cli').Migration} */
const { User } = require("../models");
const bcrypt = require("bcryptjs");

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
    await User.bulkCreate(
      [
        {
          email: "spongebob@user.io",
          username: "squarebob",
          hashedPassword: bcrypt.hashSync("gary123"),
          firstName: "Spongebob",
          lastName: "Squarepants",
        },
        {
          email: "patrick@user.io",
          username: "starfishpat",
          hashedPassword: bcrypt.hashSync("underarock3"),
          firstName: "Patrick",
          lastName: "Star",
        },
        {
          email: "squidward@user.io",
          username: "mistersquidward",
          hashedPassword: bcrypt.hashSync("tentacles"),
          firstName: "Squidward",
          lastName: "Tentacles",
        },
        {
          email: "sandy@user.io",
          username: "karatesandy",
          hashedPassword: bcrypt.hashSync("underwatersquirrel2"),
          firstName: "Sandy",
          lastName: "Cheeks",
        },
        {
          email: "krabs@user.io",
          username: "ownerkrustykrabs",
          hashedPassword: bcrypt.hashSync("ilovekrabbypatties"),
          firstName: "Eugene",
          lastName: "Krabs",
        },
        {
          email: "plankton@user.io",
          username: "ownerchumbucket",
          hashedPassword: bcrypt.hashSync("destroymrkrabs"),
          firstName: "Sheldon",
          lastName: "Plankton",
        },
        {
          email: "larry@user.io",
          username: "lobsterlarry",
          hashedPassword: bcrypt.hashSync("lifting123"),
          firstName: "Larry",
          lastName: "Lobster",
        },
        {
          email: "puffs@user.io",
          username: "teacherpuffs",
          hashedPassword: bcrypt.hashSync("iloveteaching567"),
          firstName: "Penelope",
          lastName: "Puff",
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
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "squarebob",
            "starfishpat",
            "FakeUser2",
            "mistersquidward",
            "karatesandy",
            "ownerchumbucket",
            "lobsterlarry",
            "teacherpuffs",
          ],
        },
      },
      {}
    );
  },
};
