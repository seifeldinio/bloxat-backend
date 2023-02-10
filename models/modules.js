"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class modules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ courses, lessons }) {
      // define association here
      this.belongsTo(courses, {
        foreignKey: "course_id",
      });

      this.hasMany(lessons, {
        foreignKey: "module_id",
      });
    }
  }
  modules.init(
    {
      module_id: {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "module title cannot be empty" },
          notEmpty: { msg: "module title cannot be empty" },
        },
      },
      module_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "module_order cannot be empty" },
          notEmpty: { msg: "module_order cannot be empty" },
        },
      },
      unlocks_after_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "modules",
    }
  );
  return modules;
};
