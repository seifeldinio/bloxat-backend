"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class timestamps extends Model {
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
  timestamps.init(
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seconds_duration: {
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      modelName: "timestamps",
    }
  );
  return timestamps;
};
