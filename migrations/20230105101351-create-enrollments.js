"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("enrollments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // level_progress_percentage: {
      //   type: DataTypes.FLOAT,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      // last_done_module_order: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // last_done_lesson_order: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // last_done_lesson_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // way of enrollment
      enrolled_through: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // For paymob
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
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

    // Add a unique constraint for user_id and course_id combination
    await queryInterface.addConstraint("enrollments", {
      fields: ["user_id", "course_id"],
      type: "unique",
      name: "compositeIndex",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint before dropping the table
    await queryInterface.removeConstraint("enrollments", "compositeIndex");
    await queryInterface.dropTable("enrollments");
  },
};
