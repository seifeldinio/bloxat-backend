const {
  courses,
  modules,
  lessons,
  enrollments,
  progress_users,
  users,
} = require("../../../models");

// [GET] COURSE CONTENT FOR EDITING BY ID
exports.getContentForEdit = async (req, res) => {
  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 20);
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
};

// [GET] COURSE CONTENT FOR WATCHING BY SLUG
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

// Actual get content for student function
exports.getContentForWatching = async (req, res) => {
  const courseSlug = req.params.course_slug;
  const userId = req.params.user_id;

  const courseContent = await getCourseContent(courseSlug, userId);

  if (!courseContent) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.json(courseContent);
};

// MARK AS DONE
// USER PROGRESS
exports.markAsDone = async (req, res) => {
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
};
