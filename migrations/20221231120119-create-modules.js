"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("modules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
        unique: true,
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
    await queryInterface.dropTable("modules");
  },
};
