// const express = require("express");

// const router = express.Router();
const { resources } = require("../../../../models");
// const passport = require("passport");

// [PUT] UPDATE RESOURCE
exports.updateResource = async (req, res) => {
  const id = req.params.id;

  const { resource_order, resource_type, resource_title, resource_link } =
    req.body;
  try {
    const resource = await resources.findOne({
      where: { id: id },
    });

    resource.resource_order = resource_order;
    resource.resource_type = resource_type;
    resource.resource_title = resource_title;
    resource.resource_link = resource_link;

    // section.brief_description = brief_description;

    await resource.save();

    return res.json(resource);
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
      await resources.update(
        { resource_order: item.resource_order },
        { where: { id: item.id } }
      );
    }

    // console.log("HERERERJKLEJWSRKLESJRS", list);

    return res.status(200).send("Success");
  } catch (err) {
    console.error("Error updating modules:", err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
