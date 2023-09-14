const express = require("express");

const router = express.Router();
const passport = require("passport");

const { courses, modules, lessons } = require("../../models");

// const { Op } = require("sequelize");

//COURSES
// [POST] CREATE COURSE
router.post(
  "/courses",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const {
      user_id,
      title,
      course_slug,
      // thumbnail,
      // description,
      // price,
      // introduction_video,
      // group_link,
      // level,
    } = req.body;

    try {
      const coursesReturn = await courses.create({
        user_id,
        title,
        course_slug,
        // thumbnail,
        // description,
        // price,
        // introduction_video,
        // group_link,
        // level,
      });
      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
  }
);

// [GET] ALL COURSES OF A TEACHER BY HIS user_id
router.get(
  "/courses/:user_id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const user_id = req.params.user_id;

    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    // let search = req.query.search || "";

    try {
      const coursesReturn = await courses.findAndCountAll({
        where: { user_id: user_id },

        // pagination
        limit: per_page,
        offset: offset,
      });

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] ALL PUBLISHED COURSES
router.get(
  "/courses/published",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagination
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    //search
    // let search = req.query.search || "";

    try {
      //FINALL -> ALL PROJECTS .. PLACE CONDITION INSIDE FOR FILTERS
      const coursesReturn = await courses.findAll({
        // pagination
        limit: per_page,
        offset: offset,
        where: {
          published: true,
        },
        // attributes: {
        //   exclude: [
        //     "description",
        //     "project_cost",
        //   ],
        // },
      });

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] COURSE BY SLUG
router.get(
  "/courses/slug/:course_slug",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagindation
    // let page = parseInt(req.query.page);
    // let per_page = parseInt(req.query.per_page || 10);

    // const offset = page ? page * per_page : 0;

    const courseSlug = req.params.course_slug;
    try {
      const coursesReturn = await courses.findOne({
        where: { course_slug: courseSlug },
        include: [
          // Modules
          {
            model: modules,
            required: false,
            attributes: {
              exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
            },

            // include: [
            //   {
            //     model: lessons,
            //     limit: 1,
            //     attributes: {
            //       exclude: [
            //         "lesson_id",
            //         "course_id",
            //         "module_id",
            //         "title",
            //         "lesson_order",
            //         "lesson_video_url",
            //         "description",
            //         "upsell_cta_title",
            //         "upsell_cta_url",
            //         "createdAt",
            //         "updatedAt",
            //       ],
            //     },
            //   },
            // ],
          },
          // TODO: Enrollments count
          // {
          //   model: enrollments,
          //   required: false,
          //   separate: true, // <---- Magic is here
          // },
        ],
      });

      return res.json(coursesReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] COURSE BY ID
router.get(
  "/courses/id/:id",

  // passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    //pagindation
    let page = parseInt(req.query.page);
    let per_page = parseInt(req.query.per_page || 10);

    const offset = page ? page * per_page : 0;

    const courseId = req.params.id;
    try {
      const coursesReturn = await courses.findOne({
        where: { id: courseId },
        include: [
          {
            model: modules,
            limit: per_page,
            offset: offset,
            attributes: {
              exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
            },

            // include: [
            //   {
            //     model: lessons,
            //     limit: 1,
            //     attributes: {
            //       exclude: [
            //         "lesson_id",
            //         "course_id",
            //         "module_id",
            //         "title",
            //         "lesson_order",
            //         "lesson_video_url",
            //         "description",
            //         "upsell_cta_title",
            //         "upsell_cta_url",
            //         "createdAt",
            //         "updatedAt",
            //       ],
            //     },
            //   },
            // ],
            // Order from newest to oldest
            order: [["module_order", "ASC"]],
          },
        ],
      });

      return res.json(coursesReturn);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [GET] COURSE CONTENT FOR EDITING BY ID
router.get("/courses/id/content/:id", async (req, res) => {
  // Pagination
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page || 10);
  const offset = page ? page * per_page : 0;
  const courseId = req.params.id;

  try {
    // Fetch the course without modules initially
    const course = await courses.findOne({
      where: { id: courseId },
      attributes: {
        exclude: [
          "user_id",
          "course_slug",
          "thumbnail",
          "description",
          "price",
          "group_link",
          "published",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    // Fetch the modules for the course
    const modulesData = await modules.findAll({
      where: { course_id: courseId },
      limit: per_page,
      offset: offset,
      attributes: {
        exclude: ["course_id", "module_id", "createdAt", "updatedAt"],
      },
      // Order from newest to oldest
      order: [["module_order", "ASC"]],
    });

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      modulesData.map(async (module) => {
        const moduleWithLessons = module.toJSON();

        moduleWithLessons.lessons = await lessons.findAll({
          where: { module_id: module.module_id },
          attributes: {
            exclude: [
              "course_id",
              "lesson_video_url",
              "description",
              "createdAt",
              "updatedAt",
            ],
          },
          // Order from newest to oldest
          order: [["lesson_order", "ASC"]],
        });

        return moduleWithLessons;
      })
    );

    // Combine the course and modulesWithLessons data
    const coursesReturn = {
      ...course.toJSON(),
      modules: modulesWithLessons,
    };

    return res.json(coursesReturn);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong :/" });
  }
});

// [PUT] UPDATE COURES TO -> PUBLISHED
router.put(
  "/courses/publish/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { published } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.published = published;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE COURSE INTRODUCTION VIDEO
router.put(
  "/courses/intro/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { introduction_video } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.introduction_video = introduction_video;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] COURSE THUMBNAIL
router.put(
  "/courses/thumbnail/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const { thumbnail } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.thumbnail = thumbnail;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE ALL COURSE INFO EVERYTHING

router.put(
  "/courses/all/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const {
      title,
      thumbnail,
      course_slug,
      description,
      price,
      introduction_video,
      group_link,
      level,
      published,
    } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.title = title;
      coursesReturn.thumbnail = thumbnail;
      coursesReturn.course_slug = course_slug;
      coursesReturn.description = description;
      coursesReturn.price = price;
      coursesReturn.introduction_video = introduction_video;
      coursesReturn.group_link = group_link;
      coursesReturn.level = level;
      coursesReturn.published = published;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

// [PUT] UPDATE COURSE DETAILS
router.put(
  "/courses/details/:id",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const id = req.params.id;
    const {
      title,
      // course_slug,
      description,
      price,
      published,
      // introduction_video,
      // group_link,
      // level,
    } = req.body;

    try {
      const coursesReturn = await courses.findOne({
        where: { id: id },
      });

      //update values to the value in req body
      coursesReturn.title = title;
      // coursesReturn.course_slug = course_slug;
      coursesReturn.description = description;
      coursesReturn.price = price;
      coursesReturn.published = published;

      // coursesReturn.introduction_video = introduction_video;
      // coursesReturn.group_link = group_link;
      // coursesReturn.level = level;

      await coursesReturn.save();

      return res.json(coursesReturn);
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ error: "Well ... Something went wrong :/" });
    }
  }
);

module.exports = router;
