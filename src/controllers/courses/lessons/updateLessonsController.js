// const express = require("express");

// const router = express.Router();
const { modules, lessons } = require("../../../../models");
// const passport = require("passport");
// const { Op, Sequelize } = require("sequelize");

// [PUT] UPDATE LESSON
exports.updateLesson = async (req, res) => {
  const id = req.params.id;

  const { title, lesson_order, lesson_video_url, description } = req.body;
  try {
    const lesson = await lessons.findOne({
      where: {
        id: id,
      },
    });

    lesson.title = title;
    lesson.lesson_order = lesson_order;
    lesson.lesson_video_url = lesson_video_url;
    lesson.description = description;

    await lesson.save();

    return res.json(lesson);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

// REORDER LESSONS
exports.reorderLessons = async (req, res) => {
  const { list } = req.body;
  const { module_id } = req.params;

  try {
    // Check if the module exists
    const module = await modules.findOne({ where: { id: module_id } });

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    for (let item of list) {
      await lessons.update(
        { lesson_order: item.lesson_order },
        { where: { id: item.lesson_id, module_id: module_id } }
      );
    }

    // console.log("HERERERJKLEJWSRKLESJRS", list);

    return res.status(200).send("Success");
  } catch (err) {
    console.error("Error updating modules:", err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] PARTIAL UPDATE COURSE DETAILS
exports.patchLesson = async (req, res) => {
  const id = req.params.lesson_id;
  const allowedFields = [
    "title",
    "lesson_video_url",
    "description",
    // Add other fields you want to allow for partial updates here
  ];

  try {
    const lessonReturn = await lessons.findOne({
      where: { id: id },
    });

    if (!lessonReturn) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Iterate through allowed fields and update if present in the request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        lessonReturn[field] = req.body[field];
      }
    });

    await lessonReturn.save();

    return res.json(lessonReturn);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
