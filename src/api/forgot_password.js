const express = require("express");
require("dotenv").config();

const router = express.Router();
const { users } = require("../../models");
// const passport = require("passport");

const nodemailer = require("nodemailer");

const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = process.env.OTPSECRET;

//EMAIL CONFIG
// TODO: CHANGE TO SUPPORT@BLOXAT.COM
const transporter = nodemailer.createTransport({
  //   secure: false,
  port: 587,
  //   tls: { rejectUnauthorized: false },
  //   server: "smtp.titan.email",

  host: "smtp.titan.email",
  auth: {
    user: "noreply@bloxat.app",
    pass: process.env.SUPPORTMAIL_PASS,
  },
});

const sendOTPEmail = (email, yourOtp, res) => {
  //send email
  const mailOptions = {
    from: "noreply@bloxat.app",
    to: email,
    subject: "Bloxat OTP",
    html: `<p>Forgot your password? no worries.</p> <p>Copy this OTP and paste it to change your password.</p> <p>NOTE: OTP expires after 5 minutes.</p> <p>Your OTP: ${yourOtp} </p>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    // COMMENTED OUT THE RES IT CAUSED CRASHING
    // DEPLOY
    // MORE COMMENTS
    // if (err) {
    //   res.json({
    //     status: "FAILED",
    //     message: "User doesnt exist",
    //   });
    // }
    // res.json({
    //   status: `Email Sent to ${email}!`,
    //   message: "Check your inbox and login to your account.",
    // });
  });
};

////////////// END EMAIL

//CREATE OTP FUNCTION
async function createOtp(params, callback) {
  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,

    specialChars: false,
  });

  //OTP EXPIRES AFTER 5 MINUTES
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${params.email}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
  const fullHash = `${hash}.${expires}`;

  // console.log(`Your OTP is ${otp}`);

  //SEND MAIL

  sendOTPEmail(params.email, otp);

  return callback(null, fullHash);
}

//VALIDATE OTP
async function verifyOtp(params, callback) {
  try {
    const { hash, email, otp } = params;

    if (!hash || !email || !otp) {
      return callback("Invalid parameters");
    }

    // Split the hash into hashValue and expires
    const [hashValue, expires] = hash.split(".");

    if (!hashValue || !expires) {
      return callback("Invalid hash format");
    }

    // Verify OTP expiration
    const now = Date.now();
    if (now > parseInt(expires)) {
      return callback("OTP Expired");
    }

    // Calculate the hash and compare
    const data = `${email}.${otp}.${expires}`;
    const newCalculateHash = crypto
      .createHmac("sha256", key)
      .update(data)
      .digest("hex");

    if (newCalculateHash === hashValue) {
      return callback(null, "Success");
    } else {
      return callback("Invalid OTP");
    }
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return callback("An error occurred while verifying OTP");
  }
}

async function verifyOtp(params, callback) {
  let [hashValue, expires] = params.hash.split(".");

  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");

  let data = `${params.email}.${params.otp}.${expires}`;
  let newCalculateHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");

  if (newCalculateHash === hashValue) {
    return callback(null, "Success");
  }

  return callback("Invalid OTP");
}

//Request OTP
router.post("/otp-request", (req, res) => {
  createOtp(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });

  // const { email, newGeneratedPassword } = req.body;

  // users
  //   .findOne({ where: { email: email } })
  //   .then((data) => {
  //     //user exists
  //     //proceed with email to reset password
  //     sendResetEmail(email, newGeneratedPassword, res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.json({
  //       status: "FAILED",
  //       message: "User doesnt exist",
  //     });
  //   });
});

//Verify OTP
router.post("/otp-verify", (req, res, next) => {
  verifyOtp(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
});

////////////////////////

// const { Op } = require("sequelize");

//ENCRYPTION
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");

///////////////////////////////////
//UPDATE USER PASSWORD ONLY
router.put(
  "/users/update-password/:email",
  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const email = req.params.email;

    const body = req.body;
    const salt = genSaltSync(10);
    body.hash = hashSync(body.hash, salt);

    try {
      const usersReturn = await users.findOne({
        where: { email: email },
      });

      //update values to the value in req body
      usersReturn.hash = body.hash;

      await usersReturn.save();

      return res.json(usersReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// //REQUEST TO RESET PASSWORD GIVING EMAIL

// router.post("/request-password-reset", (req, res) => {
//   const { email, newGeneratedPassword } = req.body;

//   users
//     .findOne({ where: { email: email } })
//     .then((data) => {
//       //user exists
//       //proceed with email to reset password
//       sendResetEmail(email, newGeneratedPassword, res);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json({
//         status: "FAILED",
//         message: "User doesnt exist",
//       });
//     });
// });

//SEND PASSWORD RESET EMAIL

////////////////////////////////

module.exports = router;
