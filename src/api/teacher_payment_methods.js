const express = require("express");

const router = express.Router();
// const {
//   enrollments,
//   courses,
//   users,
//   paymob_integrations,
//   instapay_integrations,
// } = require("../../models");
const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");
const CreateMethodsControllers = require("../controllers/teacher-payment-methods/createMethods");
const GetMethodsControllers = require("../controllers/teacher-payment-methods/getMethods");
const UpdateMethodsControllers = require("../controllers/teacher-payment-methods/updateMethods");

// TEACHER PAYMENT METHODS

///////////////////////////////////////////////////////////////
// PAYMOB
// [POST] CREATE PAYMOB METHODS OBJECT
router.post(
  "/paymob-integrations",
  passport.authenticate("jwt", { session: false }),
  CreateMethodsControllers.createPaymobIntegration
);

// [GET] TEACHER PAYMENT METHODS (SHOW IN THE CHECKOUT)
// router.get(
//   "/users/payment-methods/:id",
//   // passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const id = req.params.id;

//     // Search queries for enrollments and courses

//     try {
//       const usersReturn = await users.findOne({
//         where: { id: id },
//         include: [
//           {
//             model: paymob_integrations,
//             required: false,
//             attributes: {
//               exclude: ["id", "createdAt", "updatedAt"],
//             },
//           },
//         ],
//         // Don't show hash in the response
//         attributes: {
//           exclude: [
//             "hash",
//             // "createdAt",
//             "updatedAt",
//             "player_id_app",
//             "player_id_web",
//             "country",
//             "first_name",
//             "last_name",
//             "email",
//             "phone_number",
//             "avatar_url",
//             "is_admin",
//             "brand_name",
//             "brand_logo_light",
//             "brand_logo_dark",
//             "trial_end",
//             "subscription_end",
//             "createdAt",
//           ],
//         },
//       });

//       return res.json(usersReturn);
//     } catch (err) {
//       // Handle errors
//       console.log(err);
//       return res.status(500).json({ error: "Something went wrong :/" });
//     }
//   }
// );

// [GET] TEACHER PAYMENT METHODS (SHOW IN THE CHECKOUT)
router.get(
  "/users/payment-methods/:id",
  // passport.authenticate("jwt", { session: false }),
  GetMethodsControllers.getPaymentMethodsCheckout
);

// [GET] TEACHER PAYMENT METHODS BY BRAND SLUG (SHOW IN THE CHECKOUT)
router.get(
  "/users/payment-methods/brand/:brand_slug",
  // passport.authenticate("jwt", { session: false }),
  GetMethodsControllers.getPaymentMethodsCheckoutSlug
);

// [PUT] TEACHER PAYMOB METHODS
// Partial updates ... which means we don't have to provide everything in order to update just one thing
router.put(
  "/paymob-integrations/:user_id",
  passport.authenticate("jwt", { session: false }),
  UpdateMethodsControllers.updatePaymobIntegration
);

// [GET] PAYMOB INTEGRATION ONLY
router.get(
  "/users/paymob-integrations/:id",
  // passport.authenticate("jwt", { session: false }),
  GetMethodsControllers.getPaymobIntegration
);

///////////////////////////////////////////////////
// INSTAPAY
// [POST] INSTAPAY METHOD OBJECT
router.post(
  "/instapay-integrations",
  passport.authenticate("jwt", { session: false }),
  CreateMethodsControllers.createInstapayIntegration
);

// [PUT] INSTAPAY INTEGRATION
// Partial updates ... which means we don't have to provide everything in order to update just one thing
router.put(
  "/instapay-integrations/:user_id",
  passport.authenticate("jwt", { session: false }),
  UpdateMethodsControllers.updateInstapayIntegration
);

// [GET] INSTAPAY INTEGRATION ONLY
router.get(
  "/users/instapay-integrations/:id",
  // passport.authenticate("jwt", { session: false }),
  GetMethodsControllers.getInstapayIntegration
);

module.exports = router;
