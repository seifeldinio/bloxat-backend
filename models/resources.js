"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class resources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ lessons }) {
      // define association here
      this.belongsTo(lessons, {
        foreignKey: "lesson_id",
      });
    }
  }
  resources.init(
    {
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
    },
    {
      sequelize,
      modelName: "resources",
    }
  );
  return resources;
};
