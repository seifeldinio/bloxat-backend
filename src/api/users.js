const express = require("express");

const router = express.Router();
const { users, enrollments } = require("../../models");
const passport = require("passport");

const { Op } = require("sequelize");

//ENCRYPTION
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");

//USERS
//[POST] CREATE USER
router.post("/users", async (req, res) => {
  const { first_name, last_name, email, hash, phone_number } = req.body;

  const body = req.body;

  const salt = genSaltSync(10);
  body.hash = hashSync(body.hash, salt);

  try {
    const usersReturn = await users.create({
      first_name,
      last_name,
      email,
      hash: body.hash,
      phone_number,
    });
    return res.json(usersReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
});

// [GET] GET ALL USERS
router.get(
  "/users",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    let search = req.query.search || "";

    try {
      const usersReturn = await users.findAll({
        // pagination
        limit: per_page,
        offset: offset,

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["hash", "player_id_app", "player_id_web"],
        },
        // condition and search
        where: {
          [Op.and]: [
            {
              is_admin: false,
            },
          ],
          [Op.or]: [
            { user_id: { [Op.like]: `%${search}%` } },
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
          ],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
      });

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

//   [GET] GET USER BY ID
router.get(
  "/users/:id",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;

    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    try {
      const usersReturn = await users.findOne({
        where: { id: id },
        include: [
          {
            model: enrollments,
            limit: per_page,
            offset: offset,
            required: false,
            attributes: {
              exclude: ["id", "user_id", "createdAt", "updatedAt"],
            },
            // Order from newest to oldest
            order: [["createdAt", "DESC"]],
          },
        ],
        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["hash", "createdAt", "updatedAt"],
        },
      });

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE USER
router.put(
  "/users/:id",

  passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      // , phone_number
      // , country
    } = req.body;

    try {
      const usersReturn = await users.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      usersReturn.first_name = first_name;
      usersReturn.last_name = last_name;
      // usersReturn.phone_number = phone_number;
      // usersReturn.country = country;

      await usersReturn.save();

      return res.json(usersReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE PROFILE PIC
router.put(
  "/users/profile-pic/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { avatar_url } = req.body;

    try {
      const usersReturn = await users.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      usersReturn.avatar_url = avatar_url;

      await usersReturn.save();

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] GET ALL USERS WITH COUNT
router.get(
  "/countUsers/",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    let search = req.query.search || "";

    try {
      const usersReturn = await users.findAndCountAll({
        // pagination
        limit: per_page,
        offset: offset,

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["hash", "player_id_app", "player_id_web"],
        },
        // condition and search
        where: {
          [Op.and]: [
            {
              is_admin: false,
            },
          ],
          [Op.or]: [
            { user_id: { [Op.like]: `%${search}%` } },
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
          ],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
      });

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] GET ALL USERS WITH COUNT AND WITH THEIR ENROLLMENTS
router.get(
  "/countUsersEnrollments/",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    let search = req.query.search || "";

    try {
      const usersReturn = await users.findAndCountAll({
        // pagination
        limit: per_page,
        offset: offset,

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["hash", "player_id_app", "player_id_web"],
        },
        // condition and search
        where: {
          [Op.and]: [
            {
              is_admin: false,
            },
          ],
          [Op.or]: [
            { user_id: { [Op.like]: `%${search}%` } },
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
          ],
        },
        // Order from newest to oldest
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: enrollments,
            attributes: {
              exclude: ["user_id", "updatedAt", "id"],
            },

            // include: [
            //   {
            //     model: lessons,
            //     limit: 1,
            //     attributes: {
            //       exclude: [
            //         "lesson_id",
            //         "course_id",
            //         "module_id",
            //         "title",
            //         "lesson_order",
            //         "lesson_video_url",
            //         "description",
            //         "upsell_cta_title",
            //         "upsell_cta_url",
            //         "createdAt",
            //         "updatedAt",
            //       ],
            //     },
            //   },
            // ],
          },
        ],
      });

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
