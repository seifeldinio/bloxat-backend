"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class enrollments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users, courses }) {
      // define association here
      this.belongsTo(users, {
        foreignKey: "user_id",
      });

      // Relation with courses model
      this.belongsTo(courses, {
        foreignKey: "course_id",
      });
    }
  }
  enrollments.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "student",
      },
      level_progress_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      last_done_module_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_done_lesson_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_done_lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "enrollments",
    }
  );
  return enrollments;
};
