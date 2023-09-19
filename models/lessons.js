"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lessons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      courses,
      modules,
      resources,
      timestamps,
      progress_users,
    }) {
      // define association here
      // Belongs to modules
      this.belongsTo(modules, {
        foreignKey: "module_id",
      });
      // Belongs to courses
      this.belongsTo(courses, {
        foreignKey: "course_id",
      });
      // Has many resources
      this.hasMany(resources, {
        foreignKey: "lesson_id",
      });
      // Has many timestamps
      this.hasMany(timestamps, {
        foreignKey: "lesson_id",
      });

      // Has many progress_users
      this.hasMany(progress_users, {
        foreignKey: "lesson_id",
      });
    }
  }
  lessons.init(
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      module_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "lesson title cannot be empty" },
          notEmpty: { msg: "lesson title cannot be empty" },
        },
      },
      lesson_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "lesson_order cannot be empty" },
          notEmpty: { msg: "lesson_order cannot be empty" },
        },
      },
      lesson_video_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "lesson_video_url cannot be empty" },
          notEmpty: { msg: "lesson_video_url cannot be empty" },
        },
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: false,
      },
      // upsell_cta_title: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // upsell_cta_url: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
    },
    {
      sequelize,
      modelName: "lessons",
    }
  );
  return lessons;
};
