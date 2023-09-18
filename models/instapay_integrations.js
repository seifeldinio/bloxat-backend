"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class instapay_integrations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users }) {
      // define association here
      // Belongs to
      this.belongsTo(users, {
        foreignKey: "user_id",
      });
    }
  }
  instapay_integrations.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      instapay_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      instapay_address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      instapay_fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "instapay_integrations",
    }
  );
  return instapay_integrations;
};
