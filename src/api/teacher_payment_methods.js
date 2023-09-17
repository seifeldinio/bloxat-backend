const express = require("express");

const router = express.Router();
const {
  enrollments,
  courses,
  users,
  paymob_integrations,
} = require("../../models");
const passport = require("passport");
const { Op, Sequelize } = require("sequelize");

// TEACHER PAYMENT METHODS

///////////////////////////////////////////////////////////////
// PAYMOB
// [POST] CREATE PAYMOB METHODS OBJECT
router.post(
  "/paymob-integrations",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// [GET] TEACHER PAYMENT METHODS (SHOW IN THE CHECKOUT)
router.get(
  "/users/payment-methods/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      console.log(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);
// [PUT] TEACHER PAYMOB METHODS
router.put(
  "/paymob-integrations/:user_id",

  // passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;

    const {
      paymob_enabled,
      api_key,
      online_card_id,
      online_card_enabled,
      wallet_id,
      wallet_enabled,
      installment_id,
      installment_enabled,
    } = req.body;

    try {
      const paymobMethodReturn = await paymob_integrations.findOne({
        where: { user_id: userId },
      });

      //update values to the value in req body
      paymobMethodReturn.paymob_enabled = paymob_enabled;
      paymobMethodReturn.api_key = api_key;
      paymobMethodReturn.online_card_id = online_card_id;
      paymobMethodReturn.online_card_enabled = online_card_enabled;
      paymobMethodReturn.wallet_id = wallet_id;
      paymobMethodReturn.wallet_enabled = wallet_enabled;
      paymobMethodReturn.installment_id = installment_id;
      paymobMethodReturn.installment_enabled = installment_enabled;

      await paymobMethodReturn.save();

      return res.json(paymobMethodReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
