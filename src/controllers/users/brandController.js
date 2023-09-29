const {
  users,
  enrollments,
  courses,
  // modules,
  lessons,
  progress_users,
  // sequelize,
} = require("../../../models");
const { Op } = require("sequelize");
// const { genSaltSync, hashSync } = require("bcrypt");

// Get brand minimal
//   [GET] GET ONLY THE BRAND LOGO AND  NAME FOR THEIR LOGIN BRANDING
exports.getBrandMinimal = async (req, res) => {
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
          "brand_currency",
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
};

//   [GET] GET USER BY brand_slug
exports.getUserByBrandSlug = async (req, res) => {
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
};

// [GET] GET USER BY brand_slug AND USER ID to see the courses all of them and the enrollments
// Used in the student portal to get the courses of the brand and check if enrolled or not

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

exports.getBrand = async (req, res) => {
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
};
