const express = require("express");

const router = express.Router();
const { enrollments, courses, users, subscriptions } = require("../../models");
const passport = require("passport");
const { Op, Sequelize } = require("sequelize");

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
  async (req, res) => {
    try {
      console.log("Received request body:", req.body);

      const obj = req.body.obj;
      console.log("Extracted 'obj':", obj);

      // Check if the transaction is successful and not pending
      if (obj.success !== true || obj.pending !== false) {
        return res.status(400).json({ message: "Invalid transaction" });
      }

      // Extract variables
      const userId = obj.order.shipping_data.extra_description;
      const purchaseDate = obj.order.shipping_data.building;
      const endDate = obj.order.shipping_data.city;
      const plan = obj.order.shipping_data.floor;
      const amount = obj.amount_cents / 100; // Convert amount to full from cents
      const paymentMethod = obj.order.shipping_data.postal_code;
      const orderId = obj.order.id;
      const transactionId = obj.id;
      const currency = obj.currency;
      const status = obj.success;

      console.log("Extracted 'extra_description':", userId);

      const user = await users.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's subscription_end with the provided end_date
      user.subscription_end = endDate; // Assuming the field name in the user model is "subscription_end"
      await user.save(); // Save the changes to the user model

      const subscriptionsReturn = await subscriptions.create({
        user_id: user.id,
        purchase_date: purchaseDate,
        end_date: endDate,
        plan: plan,
        amount: amount,
        payment_method: paymentMethod,
        order_id: orderId,
        transaction_id: transactionId,
        currency: currency,
        status: status,
      });

      return res.json(subscriptionsReturn);
    } catch (err) {
      //   console.error(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] SUBSCRIPTIONS OF USER ID (BILLING HISTORY)
router.get(
  "/subscriptions/:user_id",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;

    // Pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);
    const offset = page ? page * per_page : 0;

    try {
      const usersReturn = await subscriptions.findAndCountAll({
        where: { user_id: userId },
        limit: per_page,
        offset: offset,
        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
      });

      return res.json(usersReturn);
    } catch (err) {
      //   console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
