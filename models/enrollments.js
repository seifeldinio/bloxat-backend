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
        unique: "compositeIndex", // Use a unique constraint for user_id and course_id combination
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: "compositeIndex", // Use a unique constraint for user_id and course_id combination
      },
      // level_progress_percentage: {
      //   type: DataTypes.FLOAT,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      // last_done_module_order: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // last_done_lesson_order: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // last_done_lesson_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
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
      indexes: [
        {
          name: "compositeIndex",
          unique: true,
          fields: ["user_id", "course_id"], // Define the composite unique index there's has to be a unique combination of user_id and course_id in order to not enroll twice
        },
      ],
    }
  );
  return enrollments;
};
