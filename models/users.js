"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      enrollments,
      courses,
      paymob_integrations,
      instapay_integrations,
    }) {
      // define association here
      // HAS MANY ENROLLMENTS -> STUDENT
      this.hasMany(enrollments, {
        foreignKey: "user_id",
      });
      // HAS MANY COURSES -> TEACHER
      this.hasMany(courses, {
        foreignKey: "user_id",
      });

      // HAS MANY PAYMOB INTEGRATION
      this.hasMany(paymob_integrations, {
        foreignKey: "user_id",
      });

      // HAS MANY INSTAPAY INTEGRATION
      this.hasMany(instapay_integrations, {
        foreignKey: "user_id",
      });
    }
  }
  users.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "first name cannot be empty" },
          notEmpty: { msg: "first name cannot be empty" },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
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
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password cannot be empty" },
          notEmpty: { msg: "password cannot be empty" },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          notNull: { msg: "phone_number cannot be empty" },
          notEmpty: { msg: "phone_number cannot be empty" },
        },
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      brand_name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      brand_slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      brand_logo_light: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brand_logo_dark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brand_currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "EGP",
      },
      trial_end: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      subscription_end: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      player_id_app: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      player_id_web: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
