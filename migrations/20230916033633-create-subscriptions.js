"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("subscriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "user_id cannot be empty" },
          notEmpty: { msg: "user_id cannot be empty" },
        },
      },
      purchase_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "purchase_date cannot be empty" },
          notEmpty: { msg: "purchase_date cannot be empty" },
        },
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "end_date cannot be empty" },
          notEmpty: { msg: "end_date cannot be empty" },
        },
      },
      plan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "plan cannot be empty" },
          notEmpty: { msg: "plan cannot be empty" },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "amount cannot be empty" },
          notEmpty: { msg: "amount cannot be empty" },
        },
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "payment_method cannot be empty" },
          notEmpty: { msg: "payment_method cannot be empty" },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "status cannot be empty" },
          notEmpty: { msg: "status cannot be empty" },
        },
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "order_id cannot be empty" },
          notEmpty: { msg: "order_id cannot be empty" },
        },
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "transaction_id cannot be empty" },
          notEmpty: { msg: "transaction_id cannot be empty" },
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
    await queryInterface.dropTable("subscriptions");
  },
};
