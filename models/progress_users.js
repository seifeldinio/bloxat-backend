"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class progress_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ lessons }) {
      // define association here
      // Belongs to
      this.belongsTo(lessons, {
        foreignKey: "lesson_id",
      });
    }
  }
  progress_users.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "progress_users",
    }
  );
  return progress_users;
};
