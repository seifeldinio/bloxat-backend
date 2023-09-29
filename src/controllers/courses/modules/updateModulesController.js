// const express = require("express");

// const router = express.Router();
const { modules } = require("../../../../models");
// const passport = require("passport");

// [PUT] UPDATE MODULE
exports.updateModule = async (req, res) => {
  const id = req.params.id;

  const { title, module_order } = req.body;
  try {
    const module = await modules.findOne({
      where: { id: id },
    });

    module.title = title;
    module.module_order = module_order;
    // module.unlocks_after_days = unlocks_after_days;

    await module.save();

    return res.json(module);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

// REORDER MODULES
exports.reorderModules = async (req, res) => {
  const { list } = req.body;

  try {
    for (let item of list) {
      await modules.update(
        { module_order: item.module_order },
        { where: { id: item.module_id } }
      );
    }

    // console.log("HERERERJKLEJWSRKLESJRS", list);

    return res.status(200).send("Success");
  } catch (err) {
    console.error("Error updating modules:", err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] PARITAL UPDATE TO SECTION
exports.patchModule = async (req, res) => {
  const id = req.params.module_id;
  const allowedFields = [
    "title",
    // Add other fields you want to allow for partial updates here
  ];

  try {
    const modulesReturn = await modules.findOne({
      where: { id: id },
    });

    if (!modulesReturn) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Iterate through allowed fields and update if present in the request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        modulesReturn[field] = req.body[field];
      }
    });

    await modulesReturn.save();

    return res.json(modulesReturn);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
