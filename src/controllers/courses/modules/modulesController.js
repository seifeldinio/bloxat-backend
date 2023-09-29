// const express = require("express");

// const router = express.Router();
const { modules, courses, lessons } = require("../../../../models");
// const passport = require("passport");

// MODULES
// [POST] CREATE MODULE
exports.createModule = async (req, res) => {
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
};

// [GET] MODULE BY MODULE ORDER NUMBER (GET MODULE BY ITS ORDER AND COURSE ID)
exports.getModuleByOrder = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [DELETE] MODULE
exports.deleteModule = async (req, res) => {
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
};
