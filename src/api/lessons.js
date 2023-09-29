const express = require("express");

const router = express.Router();
// const {
//   modules,
//   courses,
//   lessons,
//   resources,
//   timestamps,
//   enrollments,
//   progress_users,
// } = require("../../models");
const passport = require("passport");
const LessonsController = require("../controllers/courses/lessons/lessonsController");
const UpdateLessonsController = require("../controllers/courses/lessons/updateLessonsController");
// const { Op, Sequelize } = require("sequelize");

// LESSONS
// [POST] LESSON
router.post(
  "/lessons",
  passport.authenticate("jwt", { session: false }),
  LessonsController.createLesson
);

// [GET] LESSON ITS ORDER AND COURSE ID
router.get(
  "/lessons/order/:lesson_order/:module_order/:course_id",
  LessonsController.getLessonByOrder
);

// GET LESSON BY ID FOR EDITING
router.get(
  "/lessons/:course_id/edit/:lesson_id/",
  LessonsController.getLessonByIdEditing
);

// GET LESSON BY ID FOR WATCHING
router.get(
  "/lessons/:course_slug/:lesson_id/:user_id",
  LessonsController.getLessonByIdWatching
);

// [PUT] UPDATE LESSON
router.put(
  "/lessons/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateLessonsController.updateLesson
);

// [DELETE] LESSON
router.delete(
  "/lessons/:id",
  passport.authenticate("jwt", { session: false }),
  LessonsController.deleteLesson
);

// REORDER LESSONS
router.put(
  "/reorder/modules/:module_id/lessons",
  passport.authenticate("jwt", { session: false }),
  UpdateLessonsController.reorderLessons
);

// [PATCH] PARTIAL UPDATE COURSE DETAILS
router.patch(
  "/lesson/details/:lesson_id",
  passport.authenticate("jwt", { session: false }),
  UpdateLessonsController.patchLesson
);

module.exports = router;
