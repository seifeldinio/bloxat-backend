"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("timestamps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seconds_duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "seconds_duration (60 -> 1:00 .. 70 -> 1:10) cannot be empty",
          },
          notEmpty: {
            msg: "seconds_duration (60 -> 1:00 .. 70 -> 1:10) cannot be empty",
          },
        },
      },
      timestamp_title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "timestamp_title cannot be empty",
          },
          notEmpty: {
            msg: "timestamp_title cannot be empty",
          },
        },
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
    await queryInterface.dropTable("timestamps");
  },
};
