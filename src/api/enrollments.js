const express = require("express");

const router = express.Router();
// const {
//   enrollments,
//   courses,
//   users,
//   modules,
//   lessons,
//   instapay_integrations,
//   progress_users,
// } = require("../../models");
const passport = require("passport");
const CreateEnrollmentController = require("../controllers/enrollments/createEnrollmentController");
const GetEnrollmentController = require("../controllers/enrollments/getEnrollmentsControlller");
// const { Op, Sequelize } = require("sequelize");

// ENROLLMENTS
// [POST] CREATE ENROLLMENT OBJECT (Enroll in a course)
router.post(
  "/enroll",
  passport.authenticate("jwt", { session: false }),
  CreateEnrollmentController.createEnrollment
);

// [POST ENROLLMENT] PAYMOB PAYMENT CALLBACK
router.post(
  "/paymob/enroll",
  //   passport.authenticate("jwt", { session: false }),
  CreateEnrollmentController.createEnrollmentPaymob
);

// [POST] ENROLLMENT FROM INSTAPAY
router.post(
  "/instapay/enroll",
  passport.authenticate("jwt", { session: false }),
  CreateEnrollmentController.createEnrollmentInstapay
);

// [PUT] ENROLLMENT [!!LESSON] (TO UPDATE USER'S PROGRESS LESSONS)
// router.put(
//   "/markLesson/:user_id/:course_id",

//   // passport.authenticate("jwt", { session: false }),

//   // passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const userId = req.params.user_id;
//     const courseId = req.params.course_id;

//     const { last_done_lesson_order, last_done_lesson_id } = req.body;

//     try {
//       const enrollmentProgressReturn = await enrollments.findOne({
//         where: { user_id: userId, course_id: courseId },
//       });

//       //update values to the value in req body
//       enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
//       enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;

//       await enrollmentProgressReturn.save();

//       return res.json(enrollmentProgressReturn);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

// [PUT] ENROLLMENT [!!LESSON + MODULE] (TO UPDATE USER'S PROGRESS IN MODULES AND LESSONS)
// router.put(
//   "/markLessonModule/:user_id/:course_id",

//   // passport.authenticate("jwt", { session: false }),

//   // passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const userId = req.params.user_id;
//     const courseId = req.params.course_id;

//     const {
//       last_done_lesson_order,
//       last_done_lesson_id,
//       last_done_module_order,
//       level_progress_percentage,
//     } = req.body;

//     try {
//       const enrollmentProgressReturn = await enrollments.findOne({
//         where: { user_id: userId, course_id: courseId },
//       });

//       //update values to the value in req body
//       enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
//       enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;
//       enrollmentProgressReturn.last_done_module_order = last_done_module_order;
//       enrollmentProgressReturn.level_progress_percentage =
//         level_progress_percentage;

//       await enrollmentProgressReturn.save();

//       return res.json(enrollmentProgressReturn);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

// [PUT] PERCENTAGE PROGRESS
// router.put(
//   "/levelProgressPercentage/:user_id/:course_id",

//   // passport.authenticate("jwt", { session: false }),

//   // passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const userId = req.params.user_id;
//     const courseId = req.params.course_id;

//     const { level_progress_percentage } = req.body;

//     try {
//       const enrollmentProgressReturn = await enrollments.findOne({
//         where: { user_id: userId, course_id: courseId },
//       });

//       //update values to the value in req body
//       enrollmentProgressReturn.level_progress_percentage =
//         level_progress_percentage;

//       await enrollmentProgressReturn.save();

//       return res.json(enrollmentProgressReturn);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

// [PUT] ENROLLMENT (TO UPDATE USER'S PROGRESS IN MODULES AND LESSONS)
// router.put(
//   "/enrollprogress/:user_id/:course_id",

//   passport.authenticate("jwt", { session: false }),

//   // passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const userId = req.params.user_id;
//     const courseId = req.params.course_id;

//     const {
//       last_done_module_order,
//       last_done_lesson_order,
//       last_done_lesson_id,
//       level_progress_percentage,
//     } = req.body;

//     try {
//       const enrollmentProgressReturn = await enrollments.findOne({
//         where: { user_id: userId, course_id: courseId },
//       });

//       //update values to the value in req body
//       enrollmentProgressReturn.last_done_module_order = last_done_module_order;
//       enrollmentProgressReturn.last_done_lesson_order = last_done_lesson_order;
//       enrollmentProgressReturn.last_done_lesson_id = last_done_lesson_id;
//       enrollmentProgressReturn.level_progress_percentage =
//         level_progress_percentage;

//       await enrollmentProgressReturn.save();

//       return res.json(enrollmentProgressReturn);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ error: "Well ... Something went wrong :/" });
//     }
//   }
// );

// [GET] ENROLLMENT OF USER ID
// level_progress_percentage automatically sets the progress based on how many lessons are done
// done lessons / lessons.length * 100
router.get(
  "/enrollment/:user_id/:course_id",
  GetEnrollmentController.getEnrollmentByUserId
);

// [GET] ENROLLMENT OF USER ID AND COURSE SLUG
router.get(
  "/enrollment/slug/:course_slug/:user_id",
  GetEnrollmentController.getEnrollmentByUserIdCourseSlug
);

// [GET] ENROLLMENTS OF A COURSE WITH COURSE ID
router.get(
  "/enrollment/:course_id",
  // passport.authenticate("jwt", { session: false }),
  GetEnrollmentController.getEnrollmentByCourseId
);

// GET THE ENROLLMENTS WITH USER DETAILS [STUDENTS]
router.get(
  "/students-details/enrollment/:course_id",
  // passport.authenticate("jwt", { session: false }),
  GetEnrollmentController.getEnrollmentUserDetails
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
  GetEnrollmentController.getAllEnrollments
);

// [DELETE] ENROLLMENT
router.delete(
  "/unenroll/:user_id/:course_id",
  passport.authenticate("jwt", { session: false }),
  GetEnrollmentController.deleteEnrollment
);

module.exports = router;
