const { courses } = require("../../../models");

// [PUT] UPDATE COURES TO -> PUBLISHED
exports.updatePublished = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [PUT] UPDATE COURSE INTRODUCTION VIDEO
exports.updateIntro = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [PUT] COURSE THUMBNAIL
exports.updateThumbnail = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [PUT] UPDATE ALL COURSE INFO EVERYTHING
exports.updateCourse = async (req, res) => {
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
    return res.status(500).json({ error: "Well ... Something went wrong :/" });
  }
};

// [PUT] UPDATE COURSE DETAILS
// [PATCH] PARTIAL UPDATE COURSE DETAILS
exports.patchCourse = async (req, res) => {
  const id = req.params.id;
  const allowedFields = [
    "title",
    "description",
    "price",
    "published",
    "currency",
    "thumbnail",
    // Add other fields you want to allow for partial updates here
  ];

  try {
    const coursesReturn = await courses.findOne({
      where: { id: id },
    });

    if (!coursesReturn) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Iterate through allowed fields and update if present in the request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        coursesReturn[field] = req.body[field];
      }
    });

    await coursesReturn.save();

    return res.json(coursesReturn);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong :/" });
  }
};
