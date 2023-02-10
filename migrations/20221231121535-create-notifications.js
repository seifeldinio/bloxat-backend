"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      notification_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "title cannot be empty" },
          notEmpty: { msg: "title cannot be empty" },
        },
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "body cannot be empty" },
          notEmpty: { msg: "body cannot be empty" },
        },
      },
      redirect_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "redirect_url cannot be empty" },
          notEmpty: { msg: "redirect_url cannot be empty" },
        },
      },
      // Add default icon if null of Bloxat's logo
      notification_icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "notification_icon cannot be empty" },
          notEmpty: { msg: "notification_icon cannot be empty" },
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
    await queryInterface.dropTable("notifications");
  },
};
