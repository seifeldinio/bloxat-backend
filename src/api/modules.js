const express = require("express");

const router = express.Router();
// const { modules, courses, lessons } = require("../../models");
const passport = require("passport");
const ModulesController = require("../controllers/courses/modules/modulesController");
const UpdateModulesController = require("../controllers/courses/modules/updateModulesController");

// MODULES
// [POST] CREATE MODULE
router.post(
  "/modules",
  passport.authenticate("jwt", { session: false }),
  ModulesController.createModule
);

// [PUT] UPDATE MODULE
router.put(
  "/modules/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateModulesController.updateModule
);

// REORDER MODULES
router.put(
  "/reorder/modules",
  passport.authenticate("jwt", { session: false }),
  UpdateModulesController.reorderModules
);

// [PATCH] PARITAL UPDATE TO SECTION
router.patch(
  "/module/:module_id",
  passport.authenticate("jwt", { session: false }),
  UpdateModulesController.patchModule
);

// [GET] MODULE BY MODULE ORDER NUMBER (GET MODULE BY ITS ORDER AND COURSE ID)
router.get(
  "/modules/order/:order/:course_id",
  // passport.authenticate("jwt", { session: false }),
  ModulesController.getModuleByOrder
);

// [DELETE] MODULE
router.delete(
  "/modules/:id",
  passport.authenticate("jwt", { session: false }),
  ModulesController.deleteModule
);

module.exports = router;
