const express = require("express");

const router = express.Router();
const {
  modules,
  courses,
  lessons,
  resources,
  timestamps,
} = require("../../models");
const passport = require("passport");

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
