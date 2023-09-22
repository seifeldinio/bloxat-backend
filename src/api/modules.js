const express = require("express");

const router = express.Router();
const { modules, courses, lessons } = require("../../models");
const passport = require("passport");

// MODULES
// [POST] CREATE MODULE
router.post(
  "/modules",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { title, course_id, module_order } = req.body;
    try {
      const course = await courses.findOne({
        where: { id: course_id },
      });

      const modulesReturn = await modules.create({
        title,
        course_id: course.id,
        module_order,
        // unlocks_after_days,
      });

      return res.json(modulesReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [PUT] UPDATE MODULE
router.put(
  "/modules/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// REORDER MODULES
router.put(
  "/reorder/modules",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const { list } = req.body;

    try {
      for (let item of list) {
        await modules.update(
          { module_order: item.module_order },
          { where: { id: item.module_id } }
        );
      }

      console.log("HERERERJKLEJWSRKLESJRS", list);

      return res.status(200).send("Success");
    } catch (err) {
      console.error("Error updating modules:", err); // Log the error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// [PATCH] PARITAL UPDATE TO SECTION
router.patch(
  "/module/:module_id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
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
  }
);

// [GET] MODULE BY MODULE ORDER NUMBER (GET MODULE BY ITS ORDER AND COURSE ID)
router.get(
  "/modules/order/:order/:course_id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagindation
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    const moduleOrder = req.params.order;
    const courseId = req.params.course_id;

    try {
      const modulesReturn = await modules.findOne({
        where: { module_order: moduleOrder, course_id: courseId },
        include: [
          // Lessons
          {
            model: lessons,
            required: false,
            limit: per_page,
            offset: offset,
            attributes: {
              exclude: [
                "course_id",
                "module_id",
                "lesson_id",
                "lesson_video_url",
                "description",
                "upsell_cta_title",
                "upsell_cta_url",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      });

      return res.json(modulesReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [DELETE] MODULE
router.delete(
  "/modules/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;

    try {
      const module = await modules.findOne({
        where: { id: id },
      });

      await module.destroy();

      return res.json({ message: "Module Deleted" });
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
