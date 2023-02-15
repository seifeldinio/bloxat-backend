"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifications.init(
    {
      notification_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        get() {
          return this.id;
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "title cannot be empty" },
          notEmpty: { msg: "title cannot be empty" },
        },
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "body cannot be empty" },
          notEmpty: { msg: "body cannot be empty" },
        },
      },
      redirect_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      // Add default icon if null of Bloxat's logo
      from_profile_pic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "from_profile_pic cannot be empty" },
          notEmpty: { msg: "from_profile_pic cannot be empty" },
        },
      },
      from_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "from_name cannot be empty" },
          notEmpty: { msg: "from_name cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "notifications",
    }
  );
  return notifications;
};
