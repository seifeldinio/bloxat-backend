const express = require("express");

const router = express.Router();
const { free_opt_ins } = require("../../models");
// const passport = require("passport");

const { Op } = require("sequelize");

// FREE OPT INS
// [POST] OPT INTO THE FREE TRAINING .. CREATE A FREE OPT IN OBJECT GIVING YOUR INFORMATION
router.post(
  "/freeOptIns",
  //   passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { name, email } = req.body;

    try {
      const freeOptInReturn = await free_opt_ins.create({
        name,
        email,
      });
      return res.json(freeOptInReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] FREE OPT INS WITH THEIR COUNT
router.get(
  "/freeOptIns",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    let search = req.query.search || "";

    try {
      const freeOptInsReturn = await free_opt_ins.findAndCountAll({
        // pagination
        limit: per_page,
        offset: offset,

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["id", "updatedAt"],
        },
        // condition and search
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
      });

      return res.json(freeOptInsReturn);
    } catch (err) {
      //   console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] A FREE OPT IN OBJECT WITH ITS EMAIL
router.get(
  "/freeOptIns/:email",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const email = req.params.email;

    //pagination
    // let page = parseInt(req.query.page);
    // let per_page = parseInt(req.query.per_page || 10);

    // const offset = page ? page * per_page : 0;

    try {
      const freeOptInReturn = await free_opt_ins.findOne({
        where: { email: email },

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["id", "updatedAt"],
        },
      });

      return res.json(freeOptInReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
