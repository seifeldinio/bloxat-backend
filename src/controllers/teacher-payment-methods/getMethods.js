// const express = require("express");

// const router = express.Router();
const {
  // enrollments,
  // courses,
  users,
  paymob_integrations,
  instapay_integrations,
} = require("../../../models");
// const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");

// [GET] TEACHER PAYMENT METHODS (SHOW IN THE CHECKOUT)
exports.getPaymentMethodsCheckout = async (req, res) => {
  const id = req.params.id;

  // Search queries for enrollments and courses

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
      include: [
        {
          model: paymob_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: instapay_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      // Don't show hash in the response
      attributes: {
        exclude: [
          "hash",
          "updatedAt",
          "player_id_app",
          "player_id_web",
          "country",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "avatar_url",
          "is_admin",
          "brand_name",
          "brand_logo_light",
          "brand_logo_dark",
          "trial_end",
          "subscription_end",
          "createdAt",
        ],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // Handle errors
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [GET] TEACHER PAYMENT METHODS BY BRAND SLUG (SHOW IN THE CHECKOUT)
exports.getPaymentMethodsCheckoutSlug = async (req, res) => {
  const brandSlug = req.params.brand_slug;

  // Search queries for enrollments and courses

  try {
    const usersReturn = await users.findOne({
      where: { brand_slug: brandSlug },
      // paymob_integrations
      include: [
        {
          model: paymob_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: instapay_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],

      // Don't show hash in the response
      attributes: {
        exclude: [
          "hash",
          // "createdAt",
          "updatedAt",
          "player_id_app",
          "player_id_web",
          "country",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "avatar_url",
          "is_admin",
          "brand_name",
          "brand_logo_light",
          "brand_logo_dark",
          "trial_end",
          "subscription_end",
          "createdAt",
        ],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // Handle errors
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [GET] PAYMOB INTEGRATION ONLY
exports.getPaymobIntegration = async (req, res) => {
  const id = req.params.id;

  // Search queries for enrollments and courses

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
      include: [
        {
          model: paymob_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      // Don't show hash in the response
      attributes: {
        exclude: [
          "hash",
          // "createdAt",
          "updatedAt",
          "player_id_app",
          "player_id_web",
          "country",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "avatar_url",
          "is_admin",
          "brand_name",
          "brand_logo_light",
          "brand_logo_dark",
          "trial_end",
          "subscription_end",
          "createdAt",
        ],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // Handle errors
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [GET] INSTAPAY INTEGRATION ONLY
exports.getInstapayIntegration = async (req, res) => {
  const id = req.params.id;

  // Search queries for enrollments and courses

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
      include: [
        {
          model: instapay_integrations,
          required: false,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      // Don't show hash in the response
      attributes: {
        exclude: [
          "hash",
          // "createdAt",
          "updatedAt",
          "player_id_app",
          "player_id_web",
          "country",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "avatar_url",
          "is_admin",
          "brand_name",
          "brand_logo_light",
          "brand_logo_dark",
          "trial_end",
          "subscription_end",
          "createdAt",
        ],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // Handle errors
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
