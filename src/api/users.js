const express = require("express");

const router = express.Router();
const {
  users,
  enrollments,
  courses,
  modules,
  lessons,
  progress_users,
  sequelize,
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
    console.log(err);
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

// Fetch user data along with their courses and enrollments
async function getUserDataWithCoursesAndEnrollments(
  brandSlug,
  userId,
  search,
  page,
  perPage
) {
  try {
    // Fetch user data with brand information
    const userData = await users.findOne({
      where: { brand_slug: brandSlug },
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

    // Fetch user's courses and enrollments
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
        user_id: userData.id,
        published: true,
        [Op.or]: [
          {
            title: { [Op.like]: `%${search}%` },
          },
          {
            description: { [Op.like]: `%${search}%` },
          },
        ],
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
      offset: page * perPage,
    });

    return { userData, coursesWithEnrollments };
  } catch (error) {
    throw error;
  }
}

// [GET] GET USER BY brand_slug AND USER ID to see the courses all of them and the enrollments
// Used in the student portal to get the courses of the brand and check if enrolled or not
router.get("/users/brand/:brand_slug/:user_id", async (req, res) => {
  const brandSlug = req.params.brand_slug;
  const userId = req.params.user_id;
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.per_page) || 10;
  const search = req.query.search || "";

  try {
    const { userData, coursesWithEnrollments } =
      await getUserDataWithCoursesAndEnrollments(
        brandSlug,
        userId,
        search,
        page,
        perPage
      );

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
        const courseData = {
          ...course.toJSON(),
          enrollments: filteredEnrollments,
          progressPercentage,
        };

        return courseData;
      })
    );

    // Combine user data with courses and return as a single JSON response
    const response = {
      ...userData.toJSON(),
      courses: coursesWithProgress,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
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

// [PUT] UPDATE USER BRAND CURRENCY
router.put(
  "/users/brand/currency/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { brand_currency } = req.body;

    try {
      const usersReturn = await users.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      usersReturn.brand_currency = brand_currency;

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
//

//// [GET] USER'S ENROLLMENTS AND HOW MANY GOT DONE
// Define an endpoint to get enrolled courses and check completion for all courses
router.get("/dashboard/progress/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Retrieve the count of enrolled courses for the user
    const enrolledCourseCount = await countEnrolledCourses(userId);

    return res.json({
      enrolledCourseCount,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Placeholder function to count enrolled courses for a user
const countEnrolledCourses = async (userId) => {
  try {
    // Implement your logic to count enrolled courses for the user
    // Replace this with your actual implementation
    const userEnrollments = await enrollments.findAll({
      where: {
        user_id: userId,
      },
    });

    return userEnrollments.length; // Return the count of enrollments
  } catch (error) {
    console.error("Error counting enrolled courses:", error);
    throw error;
  }
};

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

// COMPARE COURSE REVENUS
router.get("/analytics/compare-courses/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Query the database to fetch courses associated with the teacher's user_id
    const teacherCourses = await courses.findAll({
      where: {
        user_id: userId, // Assuming user_id represents the teacher's ID
      },
      limit: 9,
    });

    // Calculate the total earnings and total sales for each teacher's course
    const courseEarnings = await Promise.all(
      teacherCourses.map(async (course) => {
        const total = await sequelize.query(
          `
          SELECT
            SUM(e.price) AS total
          FROM enrollments e
          WHERE e.course_id = :courseId
          `,
          {
            replacements: { courseId: course.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const sales = await sequelize.query(
          `
          SELECT
            COUNT(*) AS sales
          FROM enrollments e
          WHERE e.course_id = :courseId
          `,
          {
            replacements: { courseId: course.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        return {
          name: course.title,
          total: parseInt(total[0]?.total || 0), // Parse the total as an integer
          sales: parseInt(sales[0]?.sales || 0), // Parse sales as an integer
        };
      })
    );

    const totalRevenue = courseEarnings.reduce(
      (acc, curr) => acc + curr.total,
      0
    );

    const totalSales = courseEarnings.reduce(
      (acc, curr) => acc + curr.sales,
      0
    );

    return res.json({
      data: courseEarnings,
      totalRevenue: parseInt(totalRevenue), // Parse totalRevenue as an integer
      totalSales,
    });
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return res.status(500).json({
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    });
  }
});

module.exports = router;
