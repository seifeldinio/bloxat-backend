const express = require("express");

const router = express.Router();
const {
  modules,
  courses,
  lessons,
  resources,
  timestamps,
  enrollments,
  progress_users,
} = require("../../models");
const passport = require("passport");
const { Op, Sequelize } = require("sequelize");

// LESSONS
// [POST] LESSON
router.post(
  "/lessons",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const {
      course_id,
      module_id,
      module_order,
      title,
      lesson_order,
      lesson_video_url,
      description,
      // upsell_cta_title,
      // upsell_cta_url,
    } = req.body;

    try {
      const courseId = await courses.findOne({
        where: { id: course_id },
      });

      const moduleId = await modules.findOne({
        where: { id: module_id },
      });

      const lessonReturn = await lessons.create({
        course_id: courseId.id,
        module_id: moduleId.id,
        module_order,
        title,
        lesson_order,
        lesson_video_url,
        description,
        // upsell_cta_title,
        // upsell_cta_url,
      });

      return res.json(lessonReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] LESSON ITS ORDER AND COURSE ID
router.get(
  "/lessons/order/:lesson_order/:module_order/:course_id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const lessonOrder = req.params.lesson_order;
    const moduleOrder = req.params.module_order;
    const courseId = req.params.course_id;

    try {
      const lessonsReturn = await lessons.findOne({
        where: {
          lesson_order: lessonOrder,
          module_order: moduleOrder,
          course_id: courseId,
        },
        include: [
          // Resources
          {
            model: resources,
            required: false,
            attributes: {
              exclude: ["lesson_id", "createdAt", "updatedAt"],
            },
          },
          // Timestamps
          {
            model: timestamps,
            required: false,
            attributes: {
              exclude: ["lesson_id", "createdAt", "updatedAt"],
            },
          },
        ],
      });

      return res.json(lessonsReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// GET LESSON BY ID
router.get("/lessons/:course_slug/:lesson_id/:user_id", async (req, res) => {
  try {
    const { lesson_id, course_slug, user_id } = req.params;

    const course = await findCourse(course_slug);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const currentLesson = await findLesson(lesson_id, course.id);
    if (!currentLesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const nextLesson = await findNextLesson(
      currentLesson.lesson_order,
      course.id
    );
    const userEnrollment = await findUserEnrollment(user_id, course.id);

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = userEnrollment.last_done_lesson_order || 0;
    const level_progress_percentage = (completedLessons / totalLessons) * 100;

    userEnrollment.level_progress_percentage = level_progress_percentage;

    const progressUser = await findProgressUser(user_id, lesson_id, course.id);
    const isLessonCompleted = progressUser ? progressUser.is_completed : false;

    const response = {
      lessonData: currentLesson,
      nextLessonId: nextLesson ? nextLesson.id : null,
      enrollment: userEnrollment,
      isLessonCompleted,
    };

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

async function findCourse(courseSlug) {
  return await courses.findOne({
    where: {
      course_slug: courseSlug,
    },
    include: [
      {
        model: lessons,
        attributes: ["id", "lesson_order"],
      },
    ],
  });
}

async function findLesson(lessonId, courseId) {
  return await lessons.findOne({
    where: {
      id: lessonId,
      course_id: courseId,
    },
    include: [
      {
        model: resources,
        required: false,
        attributes: {
          exclude: ["lesson_id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
}

async function findNextLesson(lessonOrder, courseId) {
  return await lessons.findOne({
    where: {
      course_id: courseId,
      lesson_order: {
        [Op.gt]: lessonOrder,
      },
    },
    order: [["lesson_order", "ASC"]],
  });
}

async function findUserEnrollment(userId, courseId) {
  return await enrollments.findOne({
    where: { user_id: userId, course_id: courseId },
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
}

async function findProgressUser(userId, lessonId, courseId) {
  return await progress_users.findOne({
    where: {
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
    },
    attributes: {
      exclude: [
        "id",
        "course_id",
        "user_id",
        "lesson_id",
        "createdAt",
        "updatedAt",
      ],
    },
  });
}

// [PUT] UPDATE LESSON
router.put(
  "/lessons/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;

    const { title, lesson_order, lesson_video_url, description } = req.body;
    try {
      const lesson = await lessons.findOne({
        where: {
          id: id,
        },
      });

      lesson.title = title;
      lesson.lesson_order = lesson_order;
      lesson.lesson_video_url = lesson_video_url;
      lesson.description = description;

      await lesson.save();

      return res.json(lesson);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [DELETE] LESSON
router.delete(
  "/lessons/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;

    try {
      const lesson = await lessons.findOne({
        where: {
          id: id,
        },
      });

      await lesson.destroy();

      return res.json({ message: "Lesson Deleted" });
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
