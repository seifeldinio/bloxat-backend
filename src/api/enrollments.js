const express = require("express");

const router = express.Router();
const { enrollments, courses, users } = require("../../models");
const passport = require("passport");

// ENROLLMENTS
// [POST] CREATE ENROLLMENT OBJECT (Enroll in a course)
router.post(
  "/enroll",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { user_id, course_id } = req.body;
    try {
      const user = await users.findOne({
        where: { id: user_id },
      });

      const course = await courses.findOne({
        where: { id: course_id },
      });

      const enrollmentsReturn = await enrollments.create({
        user_id: user.id,
        course_id: course.id,
      });

      return res.json(enrollmentsReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [PUT] ENROLLMENT [!!LESSON] (TO UPDATE USER'S PROGRESS LESSONS)
router.put(
  "/markLesson/:user_id/:course_id",

  // passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;
    const courseId = req.params.course_id;

    const { last_done_lesson_order, last_done_lesson_id } = req.body;

    try {
      const enrollmentProgressReturn = await enrollments.findOne({
        where: { user_id: userId, course_id: courseId },
      });

      //update values to the value in req body
      enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
      enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;

      await enrollmentProgressReturn.save();

      return res.json(enrollmentProgressReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] ENROLLMENT [!!LESSON + MODULE] (TO UPDATE USER'S PROGRESS IN MODULES AND LESSONS)
router.put(
  "/markLessonModule/:user_id/:course_id",

  // passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;
    const courseId = req.params.course_id;

    const {
      last_done_lesson_order,
      last_done_lesson_id,
      last_done_module_order,
      level_progress_percentage,
    } = req.body;

    try {
      const enrollmentProgressReturn = await enrollments.findOne({
        where: { user_id: userId, course_id: courseId },
      });

      //update values to the value in req body
      enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
      enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;
      enrollmentProgressReturn.last_done_module_order = last_done_module_order;
      enrollmentProgressReturn.level_progress_percentage =
        level_progress_percentage;

      await enrollmentProgressReturn.save();

      return res.json(enrollmentProgressReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] PERCENTAGE PROGRESS
router.put(
  "/levelProgressPercentage/:user_id/:course_id",

  // passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;
    const courseId = req.params.course_id;

    const { level_progress_percentage } = req.body;

    try {
      const enrollmentProgressReturn = await enrollments.findOne({
        where: { user_id: userId, course_id: courseId },
      });

      //update values to the value in req body
      enrollmentProgressReturn.level_progress_percentage =
        level_progress_percentage;

      await enrollmentProgressReturn.save();

      return res.json(enrollmentProgressReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] ENROLLMENT (TO UPDATE USER'S PROGRESS IN MODULES AND LESSONS)
router.put(
  "/enrollprogress/:user_id/:course_id",

  passport.authenticate("jwt", { session: false }),

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;
    const courseId = req.params.course_id;

    const {
      last_done_module_order,
      last_done_lesson_order,
      last_done_lesson_id,
      level_progress_percentage,
    } = req.body;

    try {
      const enrollmentProgressReturn = await enrollments.findOne({
        where: { user_id: userId, course_id: courseId },
      });

      //update values to the value in req body
      enrollmentProgressReturn.last_done_module_order = last_done_module_order;
      enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
      enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;
      enrollmentProgressReturn.level_progress_percentage =
        level_progress_percentage;

      await enrollmentProgressReturn.save();

      return res.json(enrollmentProgressReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] ENROLLMENT OF USER ID
router.get(
  "/enrollment/:user_id/:course_id",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const userId = req.params.user_id;
    const courseId = req.params.course_id;

    //pagination
    // let page = parseInt(req.query.page);
    // let per_page = parseInt(req.query.per_page || 10);

    // const offset = page ? page * per_page : 0;

    try {
      const usersReturn = await enrollments.findOne({
        where: { user_id: userId, course_id: courseId },

        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["id", "role", "createdAt", "updatedAt"],
        },
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

// [GET] ENROLLMENTS OF A COURSE WITH COURSE ID

router.get(
  "/enrollment/:course_id",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const courseId = req.params.course_id;

    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    try {
      const enrollReturn = await enrollments.findAndCountAll({
        where: { course_id: courseId },
        // pagination
        limit: per_page,
        offset: offset,
        //DONT SHOW HASH IN THE RESPONSE
        attributes: {
          exclude: ["id", "role", "createdAt", "updatedAt"],
        },
      });

      return res.json(enrollReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] ALL ENROLLMENTS
router.get(
  "/enrollments",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
          exclude: ["id", "role", "createdAt", "updatedAt"],
        },
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

// [DELETE] ENROLLMENT
router.delete(
  "/unenroll/:user_id/:course_id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

module.exports = router;
