const {
  users,
  enrollments,
  courses,
  // modules,
  // lessons,
  // progress_users,
  // sequelize,
} = require("../../../models");
const { Op } = require("sequelize");
const { genSaltSync, hashSync } = require("bcrypt");

// Create a new user
exports.createUser = async (req, res) => {
  // Your create user logic here
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
};

// // Get all users
exports.getAllUsers = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// // Get user by ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);
  const offset = page ? page * per_page : 0;

  // Search queries for enrollments and courses
  let searchEnrollments = req.query.searchEnrollments || "";
  let searchCourses = req.query.searchCourses || "";

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
            exclude: ["id", "user_id", "updatedAt"],
          },
          where: {
            course_id: { [Op.like]: `%${searchEnrollments}%` }, // Use searchEnrollments for enrollments
          },
          // Order from newest to oldest
          order: [["createdAt", "DESC"]],
        },
        {
          model: courses,
          limit: per_page,
          offset: offset,
          required: false,
          attributes: {
            exclude: [
              "thumbnail",
              "description",
              "price",
              "introduction_video",
              "group_link",
              "updatedAt",
              "createdAt",
            ],
          },
          where: {
            id: { [Op.like]: `%${searchCourses}%` }, // Use searchCourses for courses
          },
          // Order from newest to oldest
          order: [["createdAt", "DESC"]],
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
        ],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // Handle errors
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
// // Update user
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    first_name,
    last_name,
    phone_number,
    // , country
  } = req.body;

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
    });

    //update values to the value in req body
    usersReturn.first_name = first_name;
    usersReturn.last_name = last_name;
    usersReturn.phone_number = phone_number;

    // usersReturn.phone_number = phone_number;
    // usersReturn.country = country;

    await usersReturn.save();

    return res.json(usersReturn);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [PUT] UPDATE PROFILE PIC
exports.updateProfilePic = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] GET ALL USERS WITH COUNT
exports.getAllUsersCount = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] GET ALL USERS WITH COUNT AND WITH THEIR ENROLLMENTS
exports.getAllUsersCountWithEnrollments = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};
// // Add more user-related controller functions as needed

// exports.updateUser = async (req, res) => {
//   // Your update user logic here
// };
