"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class read_notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  read_notifications.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "read_notifications",
    }
  );
  return read_notifications;
};
