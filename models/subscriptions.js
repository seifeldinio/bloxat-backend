"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subscriptions.init(
    {
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
      currency: {
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
    },
    {
      sequelize,
      modelName: "subscriptions",
    }
  );
  return subscriptions;
};
