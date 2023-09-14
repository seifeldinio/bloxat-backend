const express = require("express");

const router = express.Router();
const { users, enrollments } = require("../../models");
const passport = require("passport");

const { Op } = require("sequelize");

//ENCRYPTION
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");

//BRANDING
// [PUT] UPDATE BRAND LOGO AND NAME
router.put(
  "/branding/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { brand_name } = req.body;
    const { brand_slug } = req.body;
    const { brand_logo_light } = req.body;
    const { brand_logo_dark } = req.body;

    try {
      const usersReturn = await users.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      usersReturn.brand_name = brand_name;
      usersReturn.brand_slug = brand_slug;
      usersReturn.brand_logo_light = brand_logo_light;
      usersReturn.brand_logo_dark = brand_logo_dark;

      await usersReturn.save();

      console.log(usersReturn);

      return res.json(usersReturn);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
