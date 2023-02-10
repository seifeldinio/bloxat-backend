"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("resources", {
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
      resource_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "resource_order cannot be empty" },
          notEmpty: { msg: "resource_order cannot be empty" },
        },
      },
      resource_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "type (link, pdf, xls) cannot be empty" },
          notEmpty: { msg: "type (link, pdf, xls) cannot be empty" },
        },
      },
      resource_title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "resource link title cannot be empty" },
          notEmpty: { msg: "resource link title cannot be empty" },
        },
      },
      resource_link: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "resource link cannot be empty" },
          notEmpty: { msg: "resource link cannot be empty" },
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
    await queryInterface.dropTable("resources");
  },
};
