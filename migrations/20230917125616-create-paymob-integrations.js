"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("paymob_integrations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymob_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iframe_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      online_card_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      online_card_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wallet_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      installment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      installment_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("paymob_integrations");
  },
};
