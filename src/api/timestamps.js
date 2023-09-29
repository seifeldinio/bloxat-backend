// const express = require("express");

// const router = express.Router();
// const { lessons, timestamps } = require("../../models");
// const passport = require("passport");

// // TIMESTAMPS
// // [POST] ADD TIMESTAMP
// router.post(
//   "/timestamps",

//   passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const { lesson_id, seconds_duration, timestamp_title } = req.body;
//     try {
//       const lesson = await lessons.findOne({
//         where: { id: lesson_id },
//       });

//       const timestampsReturn = await timestamps.create({
//         lesson_id: lesson.id,
//         seconds_duration,
//         timestamp_title,
//       });

//       return res.json(timestampsReturn);
//     } catch (err) {
//       // console.log(err);
//       // to see what happened if an error occurred
//       return res.status(500).json(err);
//     }
//   }
// );

// // [PUT] UPDATE TIMESTAMP
// router.put(
//   "/timestamps/:id",

//   passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const id = req.params.id;

//     const { seconds_duration, timestamp_title } = req.body;
//     try {
//       const timestamp = await timestamps.findOne({
//         where: { id: id },
//       });

//       timestamp.seconds_duration = seconds_duration;
//       timestamp.timestamp_title = timestamp_title;

//       // section.brief_description = brief_description;

//       await timestamp.save();

//       return res.json(timestamp);
//     } catch (err) {
//       // console.log(err);
//       return res.status(500).json(err);
//     }
//   }
// );

// // [DELETE] TIMESTAMP
// router.delete(
//   "/timestamps/:id",
//   passport.authenticate("jwt", { session: false }),

//   async (req, res) => {
//     const id = req.params.id;

//     try {
//       const timestamp = await timestamps.findOne({
//         where: { id: id },
//       });

//       await timestamp.destroy();

//       return res.json({ message: "Timestamp Deleted" });
//     } catch (err) {
//       // console.log(err);
//       return res.status(500).json(err);
//     }
//   }
// );

// module.exports = router;
