const express = require("express");

const router = express.Router();
const passport = require("passport");
// const {
//   users,
//   enrollments,
//   courses,
//   modules,
//   lessons,
//   progress_users,
//   sequelize,
// } = require("../../models");
const UsersControllers = require("../controllers/users/usersController");
const BrandControllers = require("../controllers/users/brandController");
const BrandSetupControllers = require("../controllers/users/brandSetupController");
const AnalyticsControllers = require("../controllers/users/analyticsController");

// const { Op } = require("sequelize");

//ENCRYPTION
// const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");

//USERS
//[POST] CREATE USER
router.post("/users", UsersControllers.createUser);
// router.post("/users", async (req, res) => {
//   const { first_name, last_name, email, hash, phone_number } = req.body;

//   const body = req.body;

//   const salt = genSaltSync(10);
//   body.hash = hashSync(body.hash, salt);

//   try {
//     const usersReturn = await users.create({
//       first_name,
//       last_name,
//       email,
//       hash: body.hash,
//       phone_number,
//     });
//     return res.json(usersReturn);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// [GET] GET ALL USERS
router.get("/users", UsersControllers.getAllUsers);

//   [GET] GET USER BY ID
router.get("/users/:id", UsersControllers.getUserById);

//   [GET] GET ONLY THE BRAND LOGO AND  NAME FOR THEIR LOGIN BRANDING
router.get(
  "/users/brand/minimal/:brand_slug",
  BrandControllers.getBrandMinimal
);

//   [GET] GET USER BY brand_slug
router.get("/users/brand/:brand_slug", BrandControllers.getUserByBrandSlug);

// [GET] GET USER BY brand_slug AND USER ID to see the courses all of them and the enrollments
// Used in the student portal to get the courses of the brand and check if enrolled or not
router.get("/users/brand/:brand_slug/:user_id", BrandControllers.getBrand);

// [PUT] UPDATE USER
router.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  UsersControllers.updateUser
);

// [PUT] UPDATE PROFILE PIC
router.put(
  "/users/profile-pic/:id",
  passport.authenticate("jwt", { session: false }),
  UsersControllers.updateProfilePic
);

// [PUT] UPDATE USER BRAND CURRENCY
router.put(
  "/users/brand/currency/:id",
  passport.authenticate("jwt", { session: false }),
  BrandSetupControllers.updateBrandCurrency
);

// [GET] GET ALL USERS WITH COUNT
router.get(
  "/countUsers/",
  // passport.authenticate("jwt", { session: false }),
  UsersControllers.getAllUsersCount
);
//

// Define a function to count enrollments with a specific brand_slug
// const countEnrollmentsByBrandSlug = async (brandSlug) => {
//   try {
//     const count = await enrollments.count({
//       where: { brand_slug: brandSlug },
//     });
//     return count;
//   } catch (error) {
//     console.error("Error counting enrollments:", error);
//     throw error;
//   }
// };

//// [GET] USER'S ENROLLMENTS AND HOW MANY GOT DONE
// Define an endpoint to get enrolled courses and check completion for all courses
// router.get(
//   "/dashboard/progress/:user_id/brand/:brand_slug",
//   async (req, res) => {
//     const userId = req.params.user_id;
//     const brandSlug = req.params.brand_slug;

//     try {
//       // Retrieve the brand_slug for the user
//       const user = await users.findOne({ where: { user_id: userId } });
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Retrieve the count of enrolled courses for the user with the specified brand_slug
//       const enrolledCourseCount = await countEnrollmentsByBrandSlug(brandSlug);

//       return res.json({
//         enrolledCourseCount,
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

// [GET] GET ALL USERS WITH COUNT AND WITH THEIR ENROLLMENTS
router.get(
  "/countUsersEnrollments/",
  // passport.authenticate("jwt", { session: false }),
  UsersControllers.getAllUsersCountWithEnrollments
);

// COMPARE COURSE REVENUS
router.get(
  "/analytics/compare-courses/:user_id",
  AnalyticsControllers.compareCourses
);

module.exports = router;
