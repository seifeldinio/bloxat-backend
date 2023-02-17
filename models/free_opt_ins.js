"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class free_opt_ins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  free_opt_ins.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name cannot be empty" },
          notEmpty: { msg: "name cannot be empty" },
        },
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
    },
    {
      sequelize,
      modelName: "free_opt_ins",
    }
  );
  return free_opt_ins;
};
