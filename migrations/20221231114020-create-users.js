"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "first name cannot be empty" },
          notEmpty: { msg: "first name cannot be empty" },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: { msg: "email cannot be empty" },
          notEmpty: { msg: "email cannot be empty" },
        },
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password cannot be empty" },
          notEmpty: { msg: "password cannot be empty" },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "phone_number cannot be empty" },
          notEmpty: { msg: "phone_number cannot be empty" },
        },
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      player_id_app: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      player_id_web: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brand_name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      brand_slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      brand_logo_light: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brand_logo_dark: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("users");
  },
};
