"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      upsell_cta_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upsell_cta_url: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable("lessons");
  },
};
