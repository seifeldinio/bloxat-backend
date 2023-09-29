const express = require("express");

const router = express.Router();
const passport = require("passport");

// const {
//   courses,
//   modules,
//   lessons,
//   enrollments,
//   progress_users,
//   users,
//   paymob_integrations,
//   instapay_integrations,
//   sequelize,
// } = require("../../models");

// const { Op } = require("sequelize");
const CreateCourseControllers = require("../controllers/courses/createCourseController");
const ContentControllers = require("../controllers/courses/contentController");
const GetCoursesControllers = require("../controllers/courses/getCoursesController");
const UpdateCoursesController = require("../controllers/courses/updateCoursesController");

//COURSES
// [POST] CREATE COURSE
router.post(
  "/courses",
  passport.authenticate("jwt", { session: false }),
  CreateCourseControllers.createCourse
);

// [GET] ALL COURSES OF A TEACHER BY HIS user_id
router.get(
  "/courses/:user_id",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCoursesOfUserId
);

// [GET] ALL COURSES OF A TEACHER BY HIS user_id BUT LIMIT REPONSE TO ONLY THE COURSE TITLE, ID, SLUG AND IF PUBLISHED OR NOT
router.get(
  "/courses/minimal/:user_id",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCoursesOfUserIdMinimal
);

// [GET] ALL PUBLISHED COURSES
router.get(
  "/courses/published",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getAllPublishedCourses
);

// [GET] COURSE BY SLUG
router.get(
  "/courses/slug/:course_slug",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCourseBySlug
);

// [GET] GET COURSE FOR CHECKOUT details
router.get(
  "/courses/slug/checkout-details/:course_slug",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCourseCheckoutDetails
);

// [GET] COURSE BY ID
router.get(
  "/courses/id/:id",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCourseById
);

// [GET] GET COURSE TITLE BY ID
router.get(
  "/courses/title/id/:id",
  // passport.authenticate("jwt", { session: false }),
  GetCoursesControllers.getCourseTitle
);

// GET COURSE BY ID FOR HOME DASHBOARD PAGE (IF IT'S PUBLISHED .. IF PAYMENT METHOD SETUP .. AND THE BRAND SLUG FOR THE VIEW PAGE)
router.get("/warnings/course/:id", GetCoursesControllers.getCourseWarnings);

// [GET] COURSE CONTENT FOR EDITING BY ID
router.get("/courses/id/content/:id", ContentControllers.getContentForEdit);

// [GET] COURSE CONTENT FOR WATCHING BY SLUG
// [GET] COURSE CONTENT FOR STUDENTS
router.get(
  "/courses/course-content/:course_slug/:user_id",
  ContentControllers.getContentForWatching
);

// GET THE FIRST LESSON IN A COURSE AND IF THE USER IS ENROLLED OR NOT TO REDIRECT
router.get(
  "/courses/redirect/:course_slug/:user_id",
  GetCoursesControllers.getRedirect
);

// MARK AS DONE
// USER PROGRESS
router.put(
  "/mark-as-done/user/:user_id/course/:course_id/lesson/:lesson_id",
  ContentControllers.markAsDone
);

// [PUT] UPDATE COURES TO -> PUBLISHED
router.put(
  "/courses/publish/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateCoursesController.updatePublished
);

// [PUT] UPDATE COURSE INTRODUCTION VIDEO
router.put(
  "/courses/intro/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateCoursesController.updateIntro
);

// [PUT] COURSE THUMBNAIL
router.put(
  "/courses/thumbnail/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateCoursesController.updateThumbnail
);

// [PUT] UPDATE ALL COURSE INFO EVERYTHING
router.put(
  "/courses/all/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateCoursesController.updateCourse
);

// [PUT] UPDATE COURSE DETAILS
// [PATCH] PARTIAL UPDATE COURSE DETAILS
router.patch(
  "/courses/details/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateCoursesController.patchCourse
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
