"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("courses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      course_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "course title cannot be empty" },
          notEmpty: { msg: "course title cannot be empty" },
        },
      },
      course_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          notNull: { msg: "course_slug cannot be empty" },
          notEmpty: { msg: "course_slug cannot be empty" },
        },
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "thumbnail cannot be empty" },
        //   notEmpty: { msg: "thumbnail cannot be empty" },
        // },
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        // validate: {
        //   notNull: { msg: "price cannot be empty" },
        //   notEmpty: { msg: "price cannot be empty" },
        // },
      },
      // currency: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   defaultValue: "EGP",
      // },
      introduction_video: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "introduction_video cannot be empty" },
        //   notEmpty: { msg: "introduction_video cannot be empty" },
        // },
      },
      group_link: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "group_link cannot be empty" },
        //   notEmpty: { msg: "group_link cannot be empty" },
        // },
      },
      // level: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   unique: true,
      //   validate: {
      //     notNull: { msg: "level cannot be empty" },
      //     notEmpty: { msg: "level cannot be empty" },
      //   },
      // },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("courses");
  },
};
