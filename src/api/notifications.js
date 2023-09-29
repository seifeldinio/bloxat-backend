// const express = require("express");

// const router = express.Router();
// // const passport = require("passport");

// const { notifications } = require("../../models");

// // const { Op } = require("sequelize");

// // [GET] NOTIFICATIONS
// router.get(
//   "/notifications",

//   // passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     //pagindation
//     let page = parseInt(req.query.page);
//     let per_page = parseInt(req.query.per_page || 10);

//     const offset = page ? page * per_page : 0;

//     // const userId = req.params.user_id;
//     try {
//       const notificationsReturn = await notifications.findAll({
//         // pagination
//         limit: per_page,
//         offset: offset,
//         // notification of user_id
//         // where: { user_id: userId },
//         // Order from newest to oldest
//         order: [["createdAt", "DESC"]],
//       });

//       return res.json(notificationsReturn);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

// module.exports = router;
