const express = require("express");

const router = express.Router();
const {
  users,
  enrollments,
  courses,
  modules,
  lessons,
  progress_users,
} = require("../../models");
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
  }
);

//   [GET] GET USER BY brand_slug
router.get(
  "/users/brand/:brand_slug",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const brand_slug = req.params.brand_slug;

    try {
      const usersReturn = await users.findOne({
        where: { brand_slug: brand_slug },

        // Don't show hash in the response
        attributes: {
          exclude: [
            "hash",
            // "createdAt",
            "is_admin",
            "createdAt",
            "updatedAt",
            "player_id_app",
            "player_id_web",
            "country",
            "trial_end",
            "subscription_end",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "avatar_url",
          ],
        },
      });

      return res.json(usersReturn);
    } catch (err) {
      // Handle errors
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

// Helper function to exclude specific attributes from an object
const excludeAttributes = (obj, attributes) => {
  const newObj = { ...obj };
  attributes.forEach((attr) => delete newObj[attr]);
  return newObj;
};

// [GET] GET USER BY brand_slug AND USER ID to see the courses all of them and the enrollments
// Used in the student portal to get the courses of the brand and check if enrolled or not
router.get("/users/brand/:teacher_id/:user_id", async (req, res) => {
  const teacherId = req.params.teacher_id;
  const userId = req.params.user_id;

  // Pagination
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.per_page) || 10;
  const offset = page * perPage;

  // Search queries for enrollments and courses
  const search = req.query.search || "";

  try {
    const coursesWithEnrollments = await courses.findAll({
      attributes: {
        exclude: [
          "user_id",
          "introduction_video",
          "group_link",
          "updatedAt",
          "createdAt",
        ],
      },
      where: {
        user_id: teacherId,
        id: { [Op.like]: `%${search}%` },
        published: true,
      },
      include: [
        {
          model: enrollments,
          where: {
            user_id: userId,
          },
          required: false,
          attributes: {
            exclude: [
              "id",
              "createdAt",
              "updatedAt",
              "order_id",
              "transaction_id",
              "last_done_module_order",
              "last_done_lesson_order",
              "last_done_lesson_id",
              "price",
              "currency",
              "enrolled_through",
              "status",
            ], // Exclude these attributes
          },
        },
      ],
      limit: perPage,
      offset,
    });

    // Modify each course to include progressPercentage
    const coursesWithProgress = await Promise.all(
      coursesWithEnrollments.map(async (course) => {
        // Calculate progressPercentage for this course
        const progressPercentage = await calculateProgressPercentage(
          course.id,
          userId
        );

        // Exclude one of the enrollments (if there are multiple)
        const enrollments = course.enrollments || [];
        const filteredEnrollments =
          enrollments.length > 1
            ? enrollments.filter((enrollment) => enrollment.user_id === userId)
            : enrollments;

        // Exclude specific attributes from the course object
        const excludedAttributes = [
          "modules",
          "lessons",
          "enrollment",
          // Add more attributes to exclude here
        ];
        const courseData = excludeAttributes(
          course.toJSON(),
          excludedAttributes
        );
        courseData.enrollments = filteredEnrollments;

        // Include progressPercentage in course object
        return {
          ...courseData,
          progressPercentage,
        };
      })
    );

    return res.json(coursesWithProgress);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

// Function to calculate progressPercentage
async function calculateProgressPercentage(courseId, userId) {
  // Implement your logic here to calculate progressPercentage
  // You can query the progress_users table to count completed lessons for the given course and user
  const completedLessonCount = await progress_users.count({
    where: {
      user_id: userId,
      course_id: courseId,
      is_completed: true,
    },
  });

  // Query the total number of lessons in the course
  const totalLessonCount = await lessons.count({
    where: {
      course_id: courseId,
    },
  });

  // Calculate progressPercentage
  const progressPercentage = (completedLessonCount / totalLessonCount) * 100;

  return progressPercentage;
}

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
