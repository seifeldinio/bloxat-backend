const express = require("express");

const router = express.Router();
// const { enrollments, courses, users, subscriptions } = require("../../models");
// const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");
const SubscriptionsController = require("../controllers/subscriptions/subscriptionsController");

// VARIABLES MEANING
//   // paymob data
//   extra_description, // extra_description = userId
//   building, // building = purchaseDate
//   city, // city = endDate
//   floor, // floor = plan
//   postal_code, // postal_code = paymentMethod
//   order_id, // obj -> order -> id
//   transaction_id, // obj -> id
//   pending, // obj -> pending (should be false)
//   success, // obj -> success (should be true)
//   amount_cents, // obj -> amount_cents
//   currency, // obj -> currency

// SUBSCRIPTIONS
// [POST] CREATE SUBSCRIPTION OBJECT AND UPDATE THE USER'S SUBSCRIPTION_END DATE
router.post(
  "/subscriptions",
  //   passport.authenticate("jwt", { session: false }),
  SubscriptionsController.createSubscription
);

// [GET] SUBSCRIPTIONS OF USER ID (BILLING HISTORY)
router.get(
  "/subscriptions/:user_id",
  // passport.authenticate("jwt", { session: false }),
  SubscriptionsController.getSubscriptionsOfUserId
);

module.exports = router;
