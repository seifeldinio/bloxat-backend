"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ modules, lessons, enrollments, users }) {
      // define association here
      this.hasMany(modules, {
        foreignKey: "course_id",
      });
      this.hasMany(lessons, {
        foreignKey: "course_id",
      });

      // Relation with enrollments model
      this.hasMany(enrollments, {
        foreignKey: "course_id",
      });

      // Belongs to
      this.belongsTo(users, {
        foreignKey: "user_id",
      });
    }
  }
  courses.init(
    {
      course_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "course title cannot be empty" },
          notEmpty: { msg: "course title cannot be empty" },
        },
      },
      course_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "course_slug cannot be empty" },
          notEmpty: { msg: "course_slug cannot be empty" },
        },
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "thumbnail cannot be empty" },
        //   notEmpty: { msg: "thumbnail cannot be empty" },
        // },
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        // validate: {
        //   notNull: { msg: "price cannot be empty" },
        //   notEmpty: { msg: "price cannot be empty" },
        // },
      },
      introduction_video: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "introduction_video cannot be empty" },
        //   notEmpty: { msg: "introduction_video cannot be empty" },
        // },
      },
      group_link: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "group_link cannot be empty" },
        //   notEmpty: { msg: "group_link cannot be empty" },
        // },
      },
      // level: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   unique: true,
      //   validate: {
      //     notNull: { msg: "level cannot be empty" },
      //     notEmpty: { msg: "level cannot be empty" },
      //   },
      // },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "courses",
    }
  );
  return courses;
};
