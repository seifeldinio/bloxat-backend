// const express = require("express");

// const router = express.Router();
const {
  // enrollments,
  // courses,
  // users,
  paymob_integrations,
  instapay_integrations,
} = require("../../../models");
// const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");

// [PUT] TEACHER PAYMOB METHODS
// Partial updates ... which means we don't have to provide everything in order to update just one thing

exports.updatePaymobIntegration = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const updatedFields = {};

    // Iterate through the fields in the request body and update them if they exist
    for (const field in req.body) {
      updatedFields[field] = req.body[field];
    }

    const [updatedRowsCount] = await paymob_integrations.update(updatedFields, {
      where: { user_id: userId },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Fetch the updated record
    const paymobMethodReturn = await paymob_integrations.findOne({
      where: { user_id: userId },
    });

    return res.json(paymobMethodReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [PUT] INSTAPAY INTEGRATION
// Partial updates ... which means we don't have to provide everything in order to update just one thing
exports.updateInstapayIntegration = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const updatedFields = {};

    // Iterate through the fields in the request body and update them if they exist
    for (const field in req.body) {
      updatedFields[field] = req.body[field];
    }

    const [updatedRowsCount] = await instapay_integrations.update(
      updatedFields,
      {
        where: { user_id: userId },
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Fetch the updated record
    const instapayReturn = await instapay_integrations.findOne({
      where: { user_id: userId },
    });

    return res.json(instapayReturn);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
