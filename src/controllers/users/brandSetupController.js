const { users } = require("../../../models");
// const { Op } = require("sequelize");
// const { genSaltSync, hashSync } = require("bcrypt");

// [PUT] UPDATE USER BRAND CURRENCY
exports.updateBrandCurrency = async (req, res) => {
  const id = req.params.id;
  const { brand_currency } = req.body;

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
    });

    //update values to the value in req body
    usersReturn.brand_currency = brand_currency;

    // usersReturn.phone_number = phone_number;
    // usersReturn.country = country;

    await usersReturn.save();

    return res.json(usersReturn);
  } catch (err) {
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

//BRANDING
// [PUT] UPDATE BRAND LOGO AND NAME
exports.updateBrand = async (req, res) => {
  const id = req.params.id;
  const { brand_name } = req.body;
  const { brand_slug } = req.body;
  const { brand_logo_light } = req.body;
  const { brand_logo_dark } = req.body;
  const { trial_end } = req.body;

  try {
    const usersReturn = await users.findOne({
      where: { id: id },
    });

    //update values to the value in req body
    usersReturn.brand_name = brand_name;
    usersReturn.brand_slug = brand_slug;
    usersReturn.brand_logo_light = brand_logo_light;
    usersReturn.brand_logo_dark = brand_logo_dark;
    usersReturn.trial_end = trial_end;

    await usersReturn.save();

    // console.log(usersReturn);

    return res.json(usersReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};
