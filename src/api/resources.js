const express = require("express");

const router = express.Router();
const { lessons, resources } = require("../../models");
const passport = require("passport");

// RESOURCES
// [POST] ADD RESOURCE
router.post(
  "/resources",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// [PUT] UPDATE RESOURCE
router.put(
  "/resources/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// [DELETE] RESOURCE
router.delete(
  "/resources/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

module.exports = router;
