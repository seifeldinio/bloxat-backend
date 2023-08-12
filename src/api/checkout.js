const express = require("express");

const router = express.Router();
const { users, courses, enrollments } = require("../../models");
// const passport = require("passport");

//OPAY CALLBACK API
router.post("/opay-callback/:user_id/:course_id", async (req, res) => {
  const user_id = req.params.user_id;
  const course_id = req.params.course_id;

  try {
    const { payload } = req.body;

    if (payload.status === "SUCCESS") {
      const user = await users.findOne({
        where: { id: user_id },
      });

      const course = await courses.findOne({
        where: { id: course_id },
      });

      if (user && course) {
        await enrollments.create({
          user_id: user.id,
          course_id: course.id,
        });

        // Acknowledge the callback with a success message and status 200
        return res.sendStatus(200);
      } else {
        // User or course not found
        return res.status(404).json({ message: "User or course not found" });
      }
    } else {
      // Respond with a failure message and status 200
      return res.status(200).json({ message: "Payment not successful" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//CHECKOUT FUNCTIONS ONLY WITHOUT OPAY'S CALLBACK
router.post(
  "/checkout/:user_id/:course_id",
  //   passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user_id = req.params.user_id;
    const course_id = req.params.course_id;
    try {
      const { ...data } = req.body;
      // const cartList = await carts.create(data);

      if (data.status === "SUCCESS") {
        //   console.log("SUCCESS YO!");

        // ENROLL USER
        const enrollmentsReturn = await enrollments.create({
          user_id: user_id,
          course_id: course_id,
        });

        return res.json(enrollmentsReturn);

        // enrollmentsReturn();

        //   SEND ACKNOWLEDGEMENT TO OPAY WITH STATUS 200 OK
        // return res.sendStatus(200);
      } else {
        return null;
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
);

module.exports = router;
