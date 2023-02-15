const express = require("express");

const router = express.Router();
const { read_notifications, users, notifications } = require("../../models");
const passport = require("passport");

// [POST] CREATE A READ NOTIFICATION OBJECT (TO KNOW THAT THE USER READ THIS PUBLIC NOTIFICATION)
router.post(
  "/readNotifications",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { user_id, notification_id } = req.body;
    try {
      const user = await users.findOne({
        where: { id: user_id },
      });

      const notification = await notifications.findOne({
        where: { id: notification_id },
      });

      const readReturn = await read_notifications.create({
        user_id: user.id,
        notification_id: notification.id,
      });

      return res.json(readReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] ALL ENROLLMENTS
router.get(
  "/readNotifications/:user_id",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;

    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    try {
      const readReturn = await read_notifications.findAll({
        where: { user_id: userId },

        // pagination
        limit: per_page,
        offset: offset,
        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["createdAt", "updatedAt", "id"],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
      });

      return res.json(readReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
