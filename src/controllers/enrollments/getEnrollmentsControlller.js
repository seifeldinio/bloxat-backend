const {
  enrollments,
  courses,
  users,
  modules,
  lessons,
  progress_users,
} = require("../../../models");
const { Op } = require("sequelize");

// [GET] ENROLLMENT OF USER ID
// level_progress_percentage automatically sets the progress based on how many lessons are done
// done lessons / lessons.length * 100
exports.getEnrollmentByUserId = async (req, res) => {
  const userId = req.params.user_id;
  const courseId = req.params.course_id;

  try {
    // Fetch the user's enrollment data
    const userEnrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: courseId },
      attributes: {
        exclude: ["id", "updatedAt"],
      },
    });

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Fetch the user's data
    const user = await users.findOne({
      where: { id: userId },
      attributes: {
        exclude: [
          "id",
          "hash",
          "createdAt",
          "updatedAt",
          "country",
          "is_admin",
          "brand_name",
          "brand_slug",
          "brand_logo_light",
          "brand_logo_dark",
          "brand_currency",
          "trial_end",
          "subscription_end",
          "player_id_app",
          "player_id_web",
        ], // Exclude any sensitive or unnecessary user attributes
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the course data
    const course = await courses.findOne({
      where: { id: courseId },
      include: [
        {
          model: lessons,
          attributes: ["lesson_id"], // We only need to count lessons
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Count the total number of lessons for the course
    const totalLessons = course.lessons.length;

    // Calculate the number of completed lessons
    const completedLessons = userEnrollment.last_done_lesson_order || 0;

    // Calculate the level_progress_percentage
    const level_progress_percentage = (completedLessons / totalLessons) * 100;

    // Update the userEnrollment object with the calculated percentage
    userEnrollment.level_progress_percentage = level_progress_percentage;

    // Include the user data in the response
    const responseData = {
      userEnrollment,
      user,
    };

    return res.json(responseData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [GET] ENROLLMENT OF USER ID AND COURSE SLUG
exports.getEnrollmentByUserIdCourseSlug = async (req, res) => {
  const userId = req.params.user_id;
  const courseSlug = req.params.course_slug;

  try {
    // Fetch the course data
    const course = await courses.findOne({
      where: { course_slug: courseSlug },
      include: [
        {
          model: lessons,
          attributes: ["lesson_id"], // We only need to count lessons
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // console.log("PRINT", userId, course.id);

    // Fetch the user's enrollment data
    const userEnrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: course.id },
      attributes: {
        exclude: [
          "id",
          "role",
          "createdAt",
          "updatedAt",
          "price",
          "currency",
          "status",
          "enrolled_through",
          "order_id",
          "transaction_id",
        ],
      },
    });

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Count the total number of lessons for the course

    return res.json(userEnrollment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// [GET] ENROLLMENTS OF A COURSE WITH COURSE ID
exports.getEnrollmentByCourseId = async (req, res) => {
  const courseId = req.params.course_id;

  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);
  const offset = page ? page * per_page : 0;

  // Search
  let search = req.query.search || "";

  try {
    // Fetch the course currency
    const course = await courses.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate the current month's start and end dates
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const enrollReturn = await enrollments.findAndCountAll({
      where: {
        course_id: courseId,
      },
      // Pagination
      limit: per_page,
      offset: offset,
      // Don't show certain attributes in the response
      attributes: {
        exclude: [
          "id",
          "role",
          "createdAt",
          "updatedAt",
          "status",
          "enrolled_through",
          "order_id",
          "transaction_id",
        ],
      },
      // Include some data about the enrolled user
      include: [
        {
          model: users,
          required: true,
          attributes: {
            exclude: [
              "id",
              "user_id",
              "hash",
              "country",
              "is_admin",
              "phone_number",
              "brand_currency",
              "brand_name",
              "brand_logo_light",
              "brand_logo_dark",
              "player_id_app",
              "player_id_web",
              "createdAt",
              "updatedAt",
              "brand_slug",
              "trial_end",
              "subscription_end",
            ],
          },
          where: {
            [Op.or]: [
              { first_name: { [Op.like]: `%${search}%` } },
              { last_name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { phone_number: { [Op.like]: `%${search}%` } },
            ],
          },
        },
      ],
      // Order from newest to oldest
      order: [["createdAt", "DESC"]],
    });

    // Calculate the total sum of all prices for the course
    const totalSum = await enrollments.sum("price", {
      where: {
        course_id: courseId,
      },
    });

    // Calculate the total sum for the current month's enrollments
    const totalSumThisMonth = await enrollments.sum("price", {
      where: {
        course_id: courseId,
        createdAt: {
          [Op.between]: [startDate, endDate], // Filter by enrollment date within the current month
        },
      },
    });

    return res.json({
      ...enrollReturn,
      totalSum,
      totalSumThisMonth: totalSumThisMonth || 0, // Ensure it's a number and default to 0 if null
      courseSlug: course.course_slug, // Include the courseCurrency in the response
    });
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// GET THE ENROLLMENTS WITH USER DETAILS [STUDENTS]
exports.getEnrollmentUserDetails = async (req, res) => {
  const courseId = req.params.course_id;

  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);
  const offset = page ? page * per_page : 0;

  // Search
  let search = req.query.search || "";

  try {
    // Fetch the course currency
    const course = await courses.findByPk(courseId, {
      include: [
        {
          model: modules,
          include: [
            {
              model: lessons,
              attributes: ["id"],
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate the current month's start and end dates
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const enrollmentsWithProgress = await enrollments.findAndCountAll({
      where: {
        course_id: courseId,
      },
      // Pagination
      limit: per_page,
      offset: offset,
      // Don't show certain attributes in the response
      attributes: {
        exclude: [
          "id",
          "createdAt",
          "updatedAt",
          "order_id",
          "transaction_id",
          "enrolled_through",
          "currency",
          "price",
        ],
      },
      // Include some data about the enrolled user
      include: [
        {
          model: users,
          required: true,
          attributes: {
            exclude: [
              "id",
              "user_id",
              "hash",
              "country",
              "is_admin",
              // "phone_number",
              "brand_currency",
              "brand_name",
              "brand_logo_light",
              "brand_logo_dark",
              "player_id_app",
              "player_id_web",
              "createdAt",
              "updatedAt",
              "brand_slug",
              "trial_end",
              "subscription_end",
            ],
          },
          where: {
            [Op.or]: [
              { first_name: { [Op.like]: `%${search}%` } },
              { last_name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { phone_number: { [Op.like]: `%${search}%` } },
            ],
          },
        },
      ],
      // Order from newest to oldest
      order: [["createdAt", "DESC"]],
    });

    // Check if enrollmentsWithProgress has data
    if (
      !enrollmentsWithProgress ||
      !enrollmentsWithProgress.rows ||
      !Array.isArray(enrollmentsWithProgress.rows)
    ) {
      return res.status(404).json({ error: "No enrollments found" });
    }

    // Calculate progress percentages
    const progressPercentages = await Promise.all(
      enrollmentsWithProgress.rows.map(async (enrollment) => {
        const totalLessons = course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );

        const completedLessons = await progress_users.count({
          where: {
            user_id: enrollment.user_id,
            course_id: courseId,
            is_completed: true,
          },
        });

        const percentageCompleted = (completedLessons / totalLessons) * 100;

        return {
          ...enrollment.toJSON(),
          percentageCompleted,
        };
      })
    );

    return res.json({
      count: enrollmentsWithProgress.count,
      rows: progressPercentages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] ALL ENROLLMENTS
exports.getAllEnrollments = async (req, res) => {
  //pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);

  const offset = page ? page * per_page : 0;

  try {
    const usersReturn = await enrollments.findAndCountAll({
      // pagination
      limit: per_page,
      offset: offset,
      //DONT SHOW HASH IN THE RESPONSE
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });

    return res.json(usersReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [DELETE] ENROLLMENT
exports.deleteEnrollment = async (req, res) => {
  const userId = req.params.user_id;
  const courseId = req.params.course_id;

  try {
    const enrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    await enrollment.destroy();

    return res.json({ message: "Unenrolled (Enrollment Deleted!) " });
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};
