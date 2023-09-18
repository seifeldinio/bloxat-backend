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
        unique: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // way of enrollment
      enrolled_through: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // For paymob
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "enrollments",
    }
  );
  return enrollments;
};
