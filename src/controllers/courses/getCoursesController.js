const {
  courses,
  modules,
  lessons,
  enrollments,
  users,
  paymob_integrations,
  instapay_integrations,
} = require("../../../models");

// [GET] ALL COURSES OF A TEACHER BY HIS user_id
exports.getCoursesOfUserId = async (req, res) => {
  const user_id = req.params.user_id;

  //pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 50);

  const offset = page ? page * per_page : 0;

  //search
  // let search = req.query.search || "";

  try {
    const coursesReturn = await courses.findAndCountAll({
      where: { user_id: user_id },

      // pagination
      limit: per_page,
      offset: offset,
    });

    return res.json(coursesReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] ALL COURSES OF A TEACHER BY HIS user_id BUT LIMIT REPONSE TO ONLY THE COURSE TITLE, ID, SLUG AND IF PUBLISHED OR NOT
exports.getCoursesOfUserIdMinimal = async (req, res) => {
  const user_id = req.params.user_id;

  //pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 50);

  const offset = page ? page * per_page : 0;

  //search
  // let search = req.query.search || "";

  try {
    const coursesReturn = await courses.findAndCountAll({
      where: { user_id: user_id },
      attributes: {
        exclude: [
          "thumbnail",
          "description",
          "price",
          "introduction_video",
          "user_id",
          "group_link",
          "createdAt",
          "updatedAt",
        ],
      },

      // pagination
      limit: per_page,
      offset: offset,
    });

    return res.json(coursesReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] ALL PUBLISHED COURSES
exports.getAllPublishedCourses = async (req, res) => {
  //pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);

  const offset = page ? page * per_page : 0;

  //search
  // let search = req.query.search || "";

  try {
    //FINALL -> ALL PROJECTS .. PLACE CONDITION INSIDE FOR FILTERS
    const coursesReturn = await courses.findAll({
      // pagination
      limit: per_page,
      offset: offset,
      where: {
        published: true,
      },
      // attributes: {
      //   exclude: [
      //     "description",
      //     "project_cost",
      //   ],
      // },
    });

    return res.json(coursesReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] COURSE BY SLUG
exports.getCourseBySlug = async (req, res) => {
  //pagindation
  // let page = parseInt(req.query.page);
  // let per_page = parseInt(req.query.per_page || 10);

  // const offset = page ? page * per_page : 0;

  const courseSlug = req.params.course_slug;
  try {
    const coursesReturn = await courses.findOne({
      where: { course_slug: courseSlug },
      include: [
        // Modules
        {
          model: modules,
          required: false,
          attributes: {
            exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
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
        // TODO: Enrollments count
        // {
        //   model: enrollments,
        //   required: false,
        //   separate: true, // <---- Magic is here
        // },
      ],
    });

    return res.json(coursesReturn);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] GET COURSE FOR CHECKOUT details
exports.getCourseCheckoutDetails = async (req, res) => {
  const courseSlug = req.params.course_slug;
  try {
    const courseDetails = await courses.findOne({
      where: { course_slug: courseSlug },
      attributes: {
        exclude: [
          "introduction_video",
          "group_link",
          "published",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    if (!courseDetails) {
      return res.status(404).json({ error: "Course not found" });
    }

    // You can fetch the user_id, brand_currency, and brand_name here, assuming it's from a user model
    const user = await users.findByPk(courseDetails.user_id, {
      attributes: ["user_id", "brand_currency", "brand_name"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include user_id, brand_currency, and brand_name in the response
    const response = {
      ...courseDetails.toJSON(),
      user_id: user.user_id,
      brand_currency: user.brand_currency,
      brand_name: user.brand_name, // Include brand_name in the response
    };

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] COURSE BY ID
exports.getCourseById = async (req, res) => {
  //pagindation
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);

  const offset = page ? page * per_page : 0;

  const courseId = req.params.id;
  try {
    const coursesReturn = await courses.findOne({
      where: { id: courseId },
      include: [
        {
          model: modules,
          limit: per_page,
          offset: offset,
          attributes: {
            exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
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
          // Order from newest to oldest
          order: [["module_order", "ASC"]],
        },
      ],
    });

    return res.json(coursesReturn);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [GET] GET COURSE TITLE BY ID
exports.getCourseTitle = async (req, res) => {
  const courseId = req.params.id;
  try {
    const coursesReturn = await courses.findOne({
      where: { id: courseId },
      attributes: {
        exclude: [
          "course_id",
          "module_id",
          "createdAt",
          "updatedAt",
          "user_id",
          "thumbnail",
          "description",
          "price",
          "introduction_video",
          "group_link",
          "published",
        ],
      },
    });

    return res.json(coursesReturn);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// GET COURSE BY ID FOR HOME DASHBOARD PAGE (IF IT'S PUBLISHED .. IF PAYMENT METHOD SETUP .. AND THE BRAND SLUG FOR THE VIEW PAGE)
exports.getCourseWarnings = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await courses.findOne({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const isCoursePublished = course.published;
    const userId = course.user_id;

    const user = await users.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const paymobIntegration = await paymob_integrations.findOne({
      where: { user_id: userId },
    });

    const paymob_enabled = paymobIntegration
      ? paymobIntegration.paymob_enabled
      : false;

    const instapayIntegration = await instapay_integrations.findOne({
      where: { user_id: userId },
    });

    const instapay_enabled = instapayIntegration
      ? instapayIntegration.instapay_enabled
      : false;

    const brandSlug = user.brand_slug;

    return res.json({
      courseId: course.id,
      isCoursePublished,
      userId,
      paymob_enabled,
      instapay_enabled,
      brandSlug,
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// GET THE FIRST LESSON IN A COURSE AND IF THE USER IS ENROLLED OR NOT TO REDIRECT
exports.getRedirect = async (req, res) => {
  try {
    const courseSlug = req.params.course_slug;
    const userId = req.params.user_id;

    // Fetch the course, including the user_id
    const course = await courses.findOne({
      where: { course_slug: courseSlug },
      attributes: ["id", "user_id"], // Select both id and user_id
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch the first module of the course
    const firstModule = await modules.findOne({
      where: { course_id: course.id },
      attributes: ["id"],
      order: [["module_order", "ASC"]],
    });

    if (!firstModule) {
      return res
        .status(404)
        .json({ error: "No modules found for this course" });
    }

    // Fetch the first lesson of the first module
    const firstLesson = await lessons.findOne({
      where: { module_id: firstModule.id },
      attributes: ["id"],
      order: [["lesson_order", "ASC"]],
    });

    // Fetch the enrollment for the specified user and course, excluding specific fields
    const enrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: course.id },
      attributes: {
        exclude: [
          "id",
          "price",
          "currency",
          "status",
          "enrolled_through",
          "order_id",
          "transaction_id",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    // Create the desired response structure
    const jsonResponse = {
      course_id: course.id,
      id: course.id,
      user_id: course.user_id, // Include the user_id from the course
      lessons: firstLesson ? [{ id: firstLesson.id }] : [],
      enrollment: enrollment || null,
    };

    return res.json(jsonResponse);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
