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
        allowNull: true,
        defaultValue: null,
      },
      // Add default icon if null of Bloxat's logo
      from_profile_pic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "from_profile_pic cannot be empty" },
          notEmpty: { msg: "from_profile_pic cannot be empty" },
        },
      },
      from_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "from_name cannot be empty" },
          notEmpty: { msg: "from_name cannot be empty" },
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
