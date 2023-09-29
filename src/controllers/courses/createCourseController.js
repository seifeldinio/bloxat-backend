const { courses, enrollments } = require("../../../models");

// [POST] CREATE COURSE
exports.createCourse = async (req, res) => {
  const {
    user_id,
    title,
    course_slug,
    // other course properties
  } = req.body;

  try {
    const coursesReturn = await courses.create({
      user_id,
      title,
      course_slug,
      // other course properties
    });

    // Enroll the user who created the course
    await enrollments.create({
      user_id,
      course_id: coursesReturn.id, // Use the course ID returned when creating the course
      price: 0, // You can set the price to 0 or adjust it as needed
      currency: "N/A", // Set the appropriate currency
      status: "1",
      enrolled_through: "auto", // You can set this to indicate enrollment during course creation
    });

    return res.json(coursesReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};
