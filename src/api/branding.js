const express = require("express");

const router = express.Router();
const BrandSetupControllers = require("../controllers/users/brandSetupController");
// const { users, enrollments } = require("../../models");
// const passport = require("passport");

// const { Op } = require("sequelize");

//ENCRYPTION
// const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");

//BRANDING
// [PUT] UPDATE BRAND LOGO AND NAME
router.put("/branding/:id", BrandSetupControllers.updateBrand);

module.exports = router;
