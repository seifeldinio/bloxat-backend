const express = require("express");

const router = express.Router();
const {
  enrollments,
  courses,
  users,
  modules,
  lessons,
  instapay_integrations,
} = require("../../models");
const passport = require("passport");
const { Op, Sequelize } = require("sequelize");

// ENROLLMENTS
// [POST] CREATE ENROLLMENT OBJECT (Enroll in a course)
router.post(
  "/enroll",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { user_id, course_id, price, currency, enrolled_through } = req.body;
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
        currency: currency,
        status: "1",
        enrolled_through: enrolled_through,
      });

      return res.json(enrollmentsReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [POST ENROLLMENT] PAYMOB PAYMENT CALLBACK
router.post(
  "/paymob/enroll",
  //   passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("Received request body:", req.body);

      const obj = req.body.obj;
      console.log("Extracted 'obj':", obj);

      // Check if the transaction is successful and not pending
      if (obj.success !== true || obj.pending !== false) {
        return res.status(400).json({ message: "Invalid transaction" });
      }

      // Extract variables
      const userId = obj.order.shipping_data.extra_description;
      const courseId = obj.order.shipping_data.building;

      const amount = obj.amount_cents / 100; // Convert amount to full from cents
      const orderId = obj.order.id;
      const transactionId = obj.id;
      const currency = obj.currency;
      const status = obj.success;

      console.log("Extracted 'extra_description':", userId);

      const user = await users.findOne({
        where: {
          id: parseInt(userId),
        },
      });
      const course = await courses.findOne({
        where: { id: parseInt(courseId) },
      });

      if (!user || !course) {
        return res.status(404).json({ message: "User or course not found" });
      }

      const enrollmentsReturn = await enrollments.create({
        user_id: user.id,
        course_id: course.id,
        price: amount,
        currency: currency,
        status: status,
        enrolled_through: "paymob",
        order_id: orderId,
        transaction_id: transactionId,
      });

      return res.json(enrollmentsReturn);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

// [POST] ENROLLMENT FROM INSTAPAY
router.post(
  "/instapay/enroll",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user_id, course_id, price, currency, teacher_id, sms } = req.body;

    try {
      const user = await users.findOne({
        where: { id: user_id },
      });

      const course = await courses.findOne({
        where: { id: course_id },
      });

      // Extract the name from the SMS
      const nameInSMS = extractNameFromSMS(sms);

      if (!nameInSMS) {
        return res.status(400).json({ message: "Name not found in SMS" });
      }

      // Find the instapay integration for the user
      const integration = await instapay_integrations.findOne({
        where: { user_id: teacher_id },
      });

      if (!integration) {
        return res
          .status(400)
          .json({ message: "Instapay integration not found" });
      }

      // Check if the length of the extracted name matches the expected length
      const expectedLength = integration.instapay_fullname.length;

      if (nameInSMS.length === expectedLength) {
        // Create the enrollment object
        const enrollmentsReturn = await enrollments.create({
          user_id: user.id,
          course_id: course.id,
          price: price,
          currency: currency,
          status: "1",
          enrolled_through: "instapay",
        });

        return res.json(enrollmentsReturn);
      } else {
        return res.status(400).json({ message: "Name length mismatch" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

// Function to extract the name from the SMS
function extractNameFromSMS(sms) {
  // Split the SMS into words
  const words = sms.split(" ");

  // Initialize an array to store potential name parts
  const potentialNameParts = [];

  // Iterate through the words to find name parts
  for (const word of words) {
    // Check if the word contains letters and asterisks
    if (/^[A-Za-z*]+$/.test(word)) {
      potentialNameParts.push(word);
    }
  }

  // Combine the potential name parts into the name
  const nameInSMS = potentialNameParts.join(" ");

  return nameInSMS.length > 0 ? nameInSMS : null;
}

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
// level_progress_percentage automatically sets the progress based on how many lessons are done
// done lessons / lessons.length * 100
router.get("/enrollment/:user_id/:course_id", async (req, res) => {
  const userId = req.params.user_id;
  const courseId = req.params.course_id;

  try {
    // Fetch the user's enrollment data
    const userEnrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: courseId },
      attributes: {
        exclude: ["id", "role", "createdAt", "updatedAt"],
      },
    });

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Fetch the course data
    const course = await courses.findOne({
      where: { id: courseId },
      include: [
        {
          model: lessons,
          attributes: ["lesson_id"], // We only need to count lessons
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Count the total number of lessons for the course
    const totalLessons = course.lessons.length;

    // Calculate the number of completed lessons
    const completedLessons = userEnrollment.last_done_lesson_order || 0;

    // Calculate the level_progress_percentage
    const level_progress_percentage = (completedLessons / totalLessons) * 100;

    // Update the userEnrollment object with the calculated percentage
    userEnrollment.level_progress_percentage = level_progress_percentage;

    return res.json(userEnrollment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

// [GET] ENROLLMENT OF USER ID AND COURSE SLUG
router.get("/enrollment/slug/:course_slug/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const courseSlug = req.params.course_slug;

  try {
    // Fetch the course data
    const course = await courses.findOne({
      where: { course_slug: courseSlug },
      include: [
        {
          model: lessons,
          attributes: ["lesson_id"], // We only need to count lessons
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // console.log("PRINT", userId, course.id);

    // Fetch the user's enrollment data
    const userEnrollment = await enrollments.findOne({
      where: { user_id: userId, course_id: course.id },
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

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Count the total number of lessons for the course

    return res.json(userEnrollment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

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
          exclude: [
            "id",
            "role",
            "updatedAt",
            "price",
            "currency",
            "status",
            "enrolled_through",
            "order_id",
            "transaction_id",
          ],
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
                "brand_slug",
                "trial_end",
                "subscription_end",
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
      // console.log(err);
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
