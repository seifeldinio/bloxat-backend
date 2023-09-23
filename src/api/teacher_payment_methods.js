const express = require("express");

const router = express.Router();
const {
  enrollments,
  courses,
  users,
  paymob_integrations,
  instapay_integrations,
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
      console.log(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

// [GET] TEACHER PAYMENT METHODS BY BRAND SLUG (SHOW IN THE CHECKOUT)
router.get(
  "/users/payment-methods/brand/:brand_slug",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      console.log(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

// [PUT] TEACHER PAYMOB METHODS
// Partial updates ... which means we don't have to provide everything in order to update just one thing
router.put(
  "/paymob-integrations/:user_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.params.user_id;

    try {
      const updatedFields = {};

      // Iterate through the fields in the request body and update them if they exist
      for (const field in req.body) {
        updatedFields[field] = req.body[field];
      }

      const [updatedRowsCount] = await paymob_integrations.update(
        updatedFields,
        {
          where: { user_id: userId },
        }
      );

      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Fetch the updated record
      const paymobMethodReturn = await paymob_integrations.findOne({
        where: { user_id: userId },
      });

      return res.json(paymobMethodReturn);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

// [GET] PAYMOB INTEGRATION ONLY
router.get(
  "/users/paymob-integrations/:id",
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

///////////////////////////////////////////////////
// INSTAPAY
// [POST] INSTAPAY METHOD OBJECT
router.post(
  "/instapay-integrations",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// [PUT] INSTAPAY INTEGRATION
// Partial updates ... which means we don't have to provide everything in order to update just one thing
router.put(
  "/instapay-integrations/:user_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// [GET] INSTAPAY INTEGRATION ONLY
router.get(
  "/users/instapay-integrations/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      console.log(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

module.exports = router;
