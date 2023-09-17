"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class paymob_integrations extends Model {
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
  paymob_integrations.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      paymob_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      iframe_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      online_card_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      online_card_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      wallet_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      installment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      installment_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "paymob_integrations",
    }
  );
  return paymob_integrations;
};
