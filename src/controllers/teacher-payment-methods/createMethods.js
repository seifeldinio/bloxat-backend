// const express = require("express");

// const router = express.Router();
const {
  users,
  paymob_integrations,
  instapay_integrations,
} = require("../../../models");
// const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");

// TEACHER PAYMENT METHODS

///////////////////////////////////////////////////////////////
// PAYMOB
// [POST] CREATE PAYMOB METHODS OBJECT
exports.createPaymobIntegration = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await users.findOne({
      where: { id: user_id },
    });

    const paymobReturn = await paymob_integrations.create({
      user_id: user.id,
    });

    return res.json(paymobReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

///////////////////////////////////////////////////
// INSTAPAY
// [POST] INSTAPAY METHOD OBJECT
exports.createInstapayIntegration = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await users.findOne({
      where: { id: user_id },
    });

    const instapayReturn = await instapay_integrations.create({
      user_id: user.id,
    });

    return res.json(instapayReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};
