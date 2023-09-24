const express = require("express");

const router = express.Router();
const passport = require("passport");

const {
  courses,
  modules,
  lessons,
  enrollments,
  progress_users,
  users,
  paymob_integrations,
  instapay_integrations,
  sequelize,
} = require("../../models");

// const { Op } = require("sequelize");

//COURSES
// [POST] CREATE COURSE
router.post(
  "/courses",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const {
      user_id,
      title,
      course_slug,
      // other course properties
    } = req.body;

    try {
      const coursesReturn = await courses.create({
        user_id,
        title,
        course_slug,
        // other course properties
      });

      // Enroll the user who created the course
      await enrollments.create({
        user_id,
        course_id: coursesReturn.id, // Use the course ID returned when creating the course
        price: 0, // You can set the price to 0 or adjust it as needed
        currency: "N/A", // Set the appropriate currency
        status: "1",
        enrolled_through: "auto", // You can set this to indicate enrollment during course creation
      });

      return res.json(coursesReturn);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] ALL COURSES OF A TEACHER BY HIS user_id
router.get(
  "/courses/:user_id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] ALL COURSES OF A TEACHER BY HIS user_id BUT LIMIT REPONSE TO ONLY THE COURSE TITLE, ID, SLUG AND IF PUBLISHED OR NOT
router.get(
  "/courses/minimal/:user_id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] ALL PUBLISHED COURSES
router.get(
  "/courses/published",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] COURSE BY SLUG
router.get(
  "/courses/slug/:course_slug",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] GET COURSE FOR CHECKOUT details
router.get(
  "/courses/slug/checkout-details/:course_slug",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

      // You can fetch the user_id and brand_currency here, assuming it's from a user model
      const user = await users.findByPk(courseDetails.user_id, {
        attributes: ["user_id", "brand_currency"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Include user_id and brand_currency in the response
      const response = {
        ...courseDetails.toJSON(),
        user_id: user.user_id,
        brand_currency: user.brand_currency,
      };

      return res.json(response);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] COURSE BY ID
router.get(
  "/courses/id/:id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] GET COURSE TITLE BY ID
router.get(
  "/courses/title/id/:id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// GET COURSE BY ID FOR HOME DASHBOARD PAGE (IF IT'S PUBLISHED .. IF PAYMENT METHOD SETUP .. AND THE BRAND SLUG FOR THE VIEW PAGE)
router.get("/warnings/course/:id", async (req, res) => {
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
    console.log(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

// [GET] COURSE CONTENT FOR EDITING BY ID
router.get("/courses/id/content/:id", async (req, res) => {
  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);
  const offset = page ? page * per_page : 0;
  const courseId = req.params.id;

  try {
    // Fetch the course without modules initially
    const course = await courses.findOne({
      where: { id: courseId },
      include: [
        {
          model: users,
          attributes: ["brand_slug"], // Include the brand_slug field
        },
      ],
      attributes: {
        exclude: ["user_id", "group_link", "createdAt", "updatedAt"],
      },
    });

    // Fetch the modules for the course
    const modulesData = await modules.findAll({
      where: { course_id: courseId },
      limit: per_page,
      offset: offset,
      attributes: {
        exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
      },
      // Order from newest to oldest
      order: [["module_order", "ASC"]],
    });

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      modulesData.map(async (module) => {
        const moduleWithLessons = module.toJSON();

        moduleWithLessons.lessons = await lessons.findAll({
          where: { module_id: module.module_id },
          attributes: {
            exclude: [
              "course_id",
              "lesson_video_url",
              "description",
              "createdAt",
              "updatedAt",
            ],
          },
          // Order from newest to oldest
          order: [["lesson_order", "ASC"]],
        });

        return moduleWithLessons;
      })
    );

    // Combine the course and modulesWithLessons data
    const coursesReturn = {
      ...course.toJSON(),
      modules: modulesWithLessons,
    };

    return res.json(coursesReturn);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

// [GET] COURSE CONTENT FOR STUDENTS
const fetchCourseWithModulesAndLessons = async (courseSlug, userId) => {
  try {
    const course = await courses.findOne({
      where: { course_slug: courseSlug },
      attributes: {
        exclude: [
          // "user_id",
          "course_slug",
          "thumbnail",
          "description",
          "price",
          "group_link",
          "published",
          "createdAt",
          "updatedAt",
          "currency",
          "introduction_video",
        ],
      },
      include: [
        {
          model: modules,
          attributes: {
            exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
          },
          order: [["module_order", "ASC"]],
          include: [
            {
              model: lessons,
              attributes: {
                exclude: [
                  "course_id",
                  "lesson_video_url",
                  "description",
                  "createdAt",
                  "updatedAt",
                  "module_id",
                ],
              },
              order: [["lesson_order", "ASC"]],
              include: [
                {
                  model: progress_users,
                  where: { user_id: userId },
                  attributes: ["is_completed"],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [
        [modules, "module_order", "ASC"],
        [modules, lessons, "lesson_order", "ASC"],
      ],
    });

    return course;
  } catch (err) {
    console.error("Error fetching course:", err);
    return null;
  }
};

const fetchEnrollment = async (userId, courseId) => {
  try {
    const enrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: courseId },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "id",
          "price",
          "currency",
          "status",
          "enrolled_through",
          "order_id",
          "transaction_id",
          "last_done_module_order",
          "last_done_lesson_order",
          "last_done_lesson_id",
        ],
      },
    });

    return enrollment;
  } catch (err) {
    console.error("Error fetching enrollment:", err);
    return null;
  }
};

const countCompletedLessons = async (userId, courseId) => {
  try {
    const completedLessons = await progress_users.count({
      where: {
        user_id: userId,
        course_id: courseId,
        is_completed: true,
      },
    });

    return completedLessons;
  } catch (err) {
    console.error("Error counting completed lessons:", err);
    return 0;
  }
};

const calculateProgressPercentage = (totalLessons, completedLessons) => {
  return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
};

const getCourseContent = async (courseSlug, userId) => {
  try {
    const course = await fetchCourseWithModulesAndLessons(courseSlug, userId);

    if (!course) {
      return null;
    }

    const { id: courseId } = course;
    const enrollment = await fetchEnrollment(userId, courseId);
    const completedLessons = await countCompletedLessons(userId, courseId);

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );
    const percentageCompleted = calculateProgressPercentage(
      totalLessons,
      completedLessons
    );

    return {
      ...course.toJSON(),
      enrollment: enrollment || null,
      percentageCompleted,
    };
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

router.get(
  "/courses/course-content/:course_slug/:user_id",
  async (req, res) => {
    const courseSlug = req.params.course_slug;
    const userId = req.params.user_id;

    const courseContent = await getCourseContent(courseSlug, userId);

    if (!courseContent) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json(courseContent);
  }
);

// GET THE FIRST LESSON IN A COURSE AND IF THE USER IS ENROLLED OR NOT TO REDIRECT
router.get("/courses/redirect/:course_slug/:user_id", async (req, res) => {
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
});

// MARK AS DONE
// USER PROGRESS
router.put(
  "/mark-as-done/user/:user_id/course/:course_id/lesson/:lesson_id",
  async (req, res) => {
    try {
      const userId = parseInt(req.params.user_id, 10); // Parse to integer
      const courseId = parseInt(req.params.course_id, 10); // Parse to integer
      const lessonId = parseInt(req.params.lesson_id, 10); // Parse to integer

      const { is_completed } = req.body;

      const [userProgress, created] = await progress_users.findOrCreate({
        // Updated model name
        where: {
          user_id: userId,
          lesson_id: lessonId, // Use lesson_id instead of lessonId
          course_id: courseId,
        },
        defaults: {
          user_id: userId,
          lesson_id: lessonId, // Use lesson_id instead of lessonId
          course_id: courseId,
          is_completed: is_completed, // Use is_completed instead of isCompleted
        },
      });

      if (!created) {
        await userProgress.update({ is_completed: is_completed }); // Use is_completed instead of isCompleted
      }

      return res.json(userProgress);
    } catch (error) {
      console.error("[LESSON_ID_PROGRESS]", error);
      return res.status(500).json({ error: "Internal Error" });
    }
  }
);

// [PUT] UPDATE COURES TO -> PUBLISHED
router.put(
  "/courses/publish/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { published } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.published = published;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE COURSE INTRODUCTION VIDEO
router.put(
  "/courses/intro/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { introduction_video } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.introduction_video = introduction_video;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] COURSE THUMBNAIL
router.put(
  "/courses/thumbnail/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { thumbnail } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.thumbnail = thumbnail;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE ALL COURSE INFO EVERYTHING

router.put(
  "/courses/all/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const {
      title,
      thumbnail,
      course_slug,
      description,
      price,
      introduction_video,
      group_link,
      level,
      published,
    } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.title = title;
      coursesReturn.thumbnail = thumbnail;
      coursesReturn.course_slug = course_slug;
      coursesReturn.description = description;
      coursesReturn.price = price;
      coursesReturn.introduction_video = introduction_video;
      coursesReturn.group_link = group_link;
      coursesReturn.level = level;
      coursesReturn.published = published;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE COURSE DETAILS
// [PATCH] PARTIAL UPDATE COURSE DETAILS
router.patch(
  "/courses/details/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const allowedFields = [
      "title",
      "description",
      "price",
      "published",
      "currency",
      "thumbnail",
      // Add other fields you want to allow for partial updates here
    ];

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      if (!coursesReturn) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Iterate through allowed fields and update if present in the request body
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          coursesReturn[field] = req.body[field];
        }
      });

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong :/" });
    }
  }
);

// router.put(
//   "/courses/details/:id",

//   passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const id = req.params.id;
//     const {
//       title,
//       // course_slug,
//       description,
//       price,
//       published,
//       currency,
//       // introduction_video,
//       // group_link,
//       // level,
//     } = req.body;

//     try {
//       const coursesReturn = await courses.findOne({
//         where: { id: id },
//       });

//       //update values to the value in req body
//       coursesReturn.title = title;
//       // coursesReturn.course_slug = course_slug;
//       coursesReturn.description = description;
//       coursesReturn.price = price;
//       coursesReturn.published = published;
//       coursesReturn.currency = currency;

//       // coursesReturn.introduction_video = introduction_video;
//       // coursesReturn.group_link = group_link;
//       // coursesReturn.level = level;

//       await coursesReturn.save();

//       return res.json(coursesReturn);
//     } catch (err) {
//       // console.log(err);
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

module.exports = router;
