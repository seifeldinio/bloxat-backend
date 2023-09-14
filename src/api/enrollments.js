const express = require("express");

const router = express.Router();
const { enrollments, courses, users } = require("../../models");
const passport = require("passport");
const { Op, Sequelize } = require("sequelize");

// ENROLLMENTS
// [POST] CREATE ENROLLMENT OBJECT (Enroll in a course)
router.post(
  "/enroll",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { user_id, course_id, price } = req.body;
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
        price: price,
      });

      return res.json(enrollmentsReturn);
    } catch (err) {
      console.log(err);
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

    // Pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);
    const offset = page ? page * per_page : 0;

    // Search
    let search = req.query.search || "";

    try {
      const enrollReturn = await enrollments.findAndCountAll({
        where: {
          course_id: courseId,
        },
        // Pagination
        limit: per_page,
        offset: offset,
        // Don't show certain attributes in the response
        attributes: {
          exclude: ["id", "role", "updatedAt"],
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
                "brand_name",
                "brand_logo_light",
                "brand_logo_dark",
                "player_id_app",
                "player_id_web",
                "createdAt",
                "updatedAt",
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

      return res.json({
        ...enrollReturn,
        totalSum,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// GET ENROLLMENTS OF THIS MONTH ONLY AND LIMIT THE SENT DATA
// TODO: FIX IT AND IMPLEMENT IT
// router.get("/enrollment/month/:course_id", async (req, res) => {
//   const courseId = req.params.course_id;

//   // Get the current date
//   const currentDate = new Date();

//   // Calculate the start and end dates of the current month
//   const startOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     1
//   );
//   const endOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth() + 1,
//     0
//   );

//   // Pagination
//   let page = parseInt(req.query.page);
//   let per_page = parseInt(req.query.per_page || 10);
//   const offset = page ? page * per_page : 0;

//   // Search
//   let search = req.query.search || "";

//   console.log(endOfMonth);

//   try {
//     const enrollReturn = await enrollments.findAndCountAll({
//       where: {
//         course_id: courseId,
//         // Filter by createdAt within the current month
//         createdAt: {
//           [Op.between]: [startOfMonth, endOfMonth],
//         },
//       },
//       // Pagination
//       limit: per_page,
//       offset: offset,
//       // Don't show certain attributes in the response
//       attributes: {
//         exclude: ["id", "updatedAt"],
//       },
//       // Order from newest to oldest
//       order: [["createdAt", "DESC"]],
//     });

//     console.log(enrollReturn);
//     return res.json(enrollReturn);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// });

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
          exclude: ["id", "createdAt", "updatedAt"],
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
