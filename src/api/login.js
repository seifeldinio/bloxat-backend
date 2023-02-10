const express = require("express");

const router = express.Router();
const { users } = require("../../models");
//ENCRYPTION
const { compareSync } = require("bcrypt");
//JWT
const jwt = require("jsonwebtoken");
const passport = require("passport");

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await users
    .findOne({ where: { email: email } })
    .catch((err) => {
      return err;
      // console.log(err);
    });
  //IF EMAIL DOESNT EXIST
  if (!userWithEmail) return res.json({ message: "Invalid Email or password" });

  const hashCompare = compareSync(password, userWithEmail.hash);

  //IF PASSWORDHASH DOESNT MATCH
  if (!hashCompare) return res.json({ message: "Invalid Email or password" });

  const jwtToken = jwt.sign(
    {
      id: userWithEmail.id,
      email: userWithEmail.email,
    },
    process.env.JWT_SECRET
  );
  res.json({ code: 201, message: "LOGGED IN!", token: jwtToken });
});

//CHECK IF OLD PASSWORD MATCHES (TO CHANGE PASSWORD)
router.post(
  "/check-old-password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, password } = req.body;

    const userWithEmail = await users
      .findOne({ where: { id: id } })
      .catch((err) => {
        return err;
        // console.log(err);
      });
    //IF EMAIL DOESNT EXIST
    if (!id) return res.json({ message: "user not found" });

    const hashCompare = compareSync(password, userWithEmail.hash);

    //IF PASSWORDHASH DOESNT MATCH
    if (!hashCompare) return res.json({ message: "Old password isnt correct" });

    // const jwtToken = jwt.sign(
    //   {
    //     id: userWithEmail.id,
    //     email: userWithEmail.email,
    //   },
    //   process.env.JWT_SECRET
    // );
    res.json({ code: 201, message: "OLD PASSWORD MATCHES!" });
  }
);

//DECODE JWT
//TO GET THE LOGGED IN USER INFO FROM HIS/HER ID
router.get("/decode-jwt", async (req, res) => {
  let token = req.headers.authorization;
  let jwt_secret_key = process.env.JWT_SECRET;

  jwt.verify(token, jwt_secret_key, async (err, data) => {
    if (err) {
      // console.log(err);
      return res.send({
        code: 403,
        message: null,
      });
    } else {
      var userId = data.id;
      return res.send({
        code: 200,
        id: userId,
        message: data,
      });
    }
  });
});

module.exports = router;
