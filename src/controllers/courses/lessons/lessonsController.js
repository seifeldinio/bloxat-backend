// const express = require("express");

// const router = express.Router();
const {
  modules,
  courses,
  lessons,
  resources,
  timestamps,
  enrollments,
  progress_users,
} = require("../../../../models");
// const passport = require("passport");
const { Op } = require("sequelize");

// LESSONS
// [POST] LESSON
exports.createLesson = async (req, res) => {
  const {
    course_id,
    module_id,
    module_order,
    title,
    lesson_order,
    lesson_video_url,
    description,
    // upsell_cta_title,
    // upsell_cta_url,
  } = req.body;

  try {
    const courseId = await courses.findOne({
      where: { id: course_id },
    });

    const moduleId = await modules.findOne({
      where: { id: module_id },
    });

    const lessonReturn = await lessons.create({
      course_id: courseId.id,
      module_id: moduleId.id,
      module_order,
      title,
      lesson_order,
      lesson_video_url,
      description,
      // upsell_cta_title,
      // upsell_cta_url,
    });

    return res.json(lessonReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

// [GET] LESSON ITS ORDER AND COURSE ID
exports.getLessonByOrder = async (req, res) => {
  const lessonOrder = req.params.lesson_order;
  const moduleOrder = req.params.module_order;
  const courseId = req.params.course_id;

  try {
    const lessonsReturn = await lessons.findOne({
      where: {
        lesson_order: lessonOrder,
        module_order: moduleOrder,
        course_id: courseId,
      },
      include: [
        // Resources
        {
          model: resources,
          required: false,
          attributes: {
            exclude: ["lesson_id", "createdAt", "updatedAt"],
          },
        },
        // Timestamps
        {
          model: timestamps,
          required: false,
          attributes: {
            exclude: ["lesson_id", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    return res.json(lessonsReturn);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
};

// GET LESSON BY ID FOR EDITING
exports.getLessonByIdEditing = async (req, res) => {
  try {
    const { lesson_id, course_id } = req.params;

    const course = await findCourseById(course_id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const currentLesson = await findLesson(lesson_id, course.id);

    if (!currentLesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Create the lessonData object with specific properties
    const lessonData = {
      lesson_id: currentLesson.id,
      id: currentLesson.id,
      course_id: currentLesson.course_id,
      title: currentLesson.title,
      lesson_order: currentLesson.lesson_order,
      lesson_video_url: currentLesson.lesson_video_url,
      description: currentLesson.description,
      resources: currentLesson.resources, // Include resources
    };

    return res.json(lessonData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

// GET LESSON BY ID FOR WATCHING
exports.getLessonByIdWatching = async (req, res) => {
  try {
    const { lesson_id, course_slug, user_id } = req.params;

    const course = await findCourse(course_slug);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const currentLesson = await findLesson(lesson_id, course.id);
    if (!currentLesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const nextLesson = await findNextLesson(currentLesson);

    const userEnrollment = await findUserEnrollment(user_id, course.id);

    if (!userEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = userEnrollment.last_done_lesson_order || 0;
    const level_progress_percentage = (completedLessons / totalLessons) * 100;

    userEnrollment.level_progress_percentage = level_progress_percentage;

    const progressUser = await findProgressUser(user_id, lesson_id, course.id);
    const isLessonCompleted = progressUser ? progressUser.is_completed : false;

    const response = {
      lessonData: currentLesson,
      nextLessonId: nextLesson ? nextLesson.id : null,
      enrollment: userEnrollment,
      isLessonCompleted,
    };

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};

async function findCourse(courseSlug) {
  return await courses.findOne({
    where: {
      course_slug: courseSlug,
    },
    include: [
      {
        model: lessons,
        attributes: ["id", "lesson_order"],
      },
    ],
  });
}

async function findLesson(lessonId, courseId) {
  return await lessons.findOne({
    where: {
      id: lessonId,
      course_id: courseId,
    },
    include: [
      {
        model: resources,
        required: false,
        attributes: {
          exclude: ["lesson_id", "createdAt", "updatedAt"],
        },
      },
    ],
    order: [[{ model: resources, as: "resources" }, "resource_order", "ASC"]],
  });
}
const findNextLesson = async (currentLesson) => {
  try {
    // Find the next lesson in the current module with a higher lesson_order
    const nextLessonInSameModule = await lessons.findOne({
      where: {
        module_id: currentLesson.module_id,
        lesson_order: {
          [Op.gt]: currentLesson.lesson_order,
        },
      },
      order: [["lesson_order", "ASC"]],
    });

    if (nextLessonInSameModule) {
      return nextLessonInSameModule;
    }

    // If there are no more lessons in the current module, find the next module
    const currentModule = await modules.findByPk(currentLesson.module_id);
    const nextModuleOrder = currentModule.module_order + 1;

    const nextModule = await modules.findOne({
      where: {
        course_id: currentLesson.course_id,
        module_order: nextModuleOrder,
      },
    });

    if (nextModule) {
      // Find the first lesson in the next module
      const firstLessonNextModule = await lessons.findOne({
        where: {
          module_id: nextModule.id,
          lesson_order: 0,
        },
      });

      return firstLessonNextModule;
    }

    return null; // Return null if there are no more lessons
  } catch (error) {
    console.error("Error in findNextLesson:", error);
    return null; // Return null or handle the error as needed
  }
};

async function findUserEnrollment(userId, courseId) {
  return await enrollments.findOne({
    where: { user_id: userId, course_id: courseId },
    attributes: {
      exclude: [
        "id",
        "role",
        "createdAt",
        "updatedAt",
        "price",
        "currency",
        "status",
        "enrolled_through",
        "order_id",
        "transaction_id",
      ],
    },
  });
}

async function findProgressUser(userId, lessonId, courseId) {
  return await progress_users.findOne({
    where: {
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
    },
    attributes: {
      exclude: [
        "id",
        "course_id",
        "user_id",
        "lesson_id",
        "createdAt",
        "updatedAt",
      ],
    },
  });
}

// find cousre by id
async function findCourseById(courseId) {
  return await courses.findOne({
    where: {
      id: courseId,
    },
    include: [
      {
        model: lessons,
        attributes: ["id", "lesson_order"],
      },
    ],
  });
}

// [DELETE] LESSON
exports.deleteLesson = async (req, res) => {
  const id = req.params.id;

  try {
    const lesson = await lessons.findOne({
      where: {
        id: id,
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.course_id;

    // Find the course associated with the lesson
    const course = await courses.findOne({
      where: {
        id: courseId,
      },
      include: [
        {
          model: lessons,
          as: "lessons",
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course has only one lesson
    if (course.lessons.length === 1) {
      // Update the course's published status to false
      await courses.update(
        { published: false },
        {
          where: {
            id: courseId,
          },
        }
      );
    }

    // Delete the lesson
    await lesson.destroy();

    return res.json({ message: "Lesson Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
