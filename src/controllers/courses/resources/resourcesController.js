// const express = require("express");

// const router = express.Router();
const { lessons, resources } = require("../../../../models");
// const passport = require("passport");

// RESOURCES
// [POST] ADD RESOURCE
exports.createResource = async (req, res) => {
  const {
    lesson_id,
    resource_order,
    resource_type,
    resource_title,
    resource_link,
  } = req.body;
  try {
    const lesson = await lessons.findOne({
      where: { id: lesson_id },
    });

    const resourcesReturn = await resources.create({
      lesson_id: lesson.id,
      resource_order,
      resource_type,
      resource_title,
      resource_link,
    });

    return res.json(resourcesReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

// [DELETE] RESOURCE
exports.deleteResource = async (req, res) => {
  const id = req.params.id;

  try {
    const resource = await resources.findOne({
      where: { id: id },
    });

    await resource.destroy();

    return res.json({ message: "Resource Deleted" });
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};
