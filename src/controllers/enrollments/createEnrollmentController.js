const {
  enrollments,
  courses,
  users,

  instapay_integrations,
} = require("../../../models");
// const { Op, Sequelize } = require("sequelize");

// ENROLLMENTS
// [POST] CREATE ENROLLMENT OBJECT (Enroll in a course)
exports.createEnrollment = async (req, res) => {
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
};

// [POST ENROLLMENT] PAYMOB PAYMENT CALLBACK
exports.createEnrollmentPaymob = async (req, res) => {
  try {
    // console.log("Received request body:", req.body);

    const obj = req.body.obj;
    // console.log("Extracted 'obj':", obj);

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

    // console.log("Extracted 'extra_description':", userId);

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
};

// [POST] ENROLLMENT FROM INSTAPAY
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

exports.createEnrollmentInstapay = async (req, res) => {
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
};
