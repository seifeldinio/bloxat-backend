const express = require("express");

const router = express.Router();
// const { lessons, resources } = require("../../models");
const passport = require("passport");
const ResourcesController = require("../controllers/courses/resources/resourcesController");
const UpdateResourcesController = require("../controllers/courses/resources/updateResourcesController");

// RESOURCES
// [POST] ADD RESOURCE
router.post(
  "/resources",
  passport.authenticate("jwt", { session: false }),
  ResourcesController.createResource
);

// [PUT] UPDATE RESOURCE
router.put(
  "/resources/:id",
  passport.authenticate("jwt", { session: false }),
  UpdateResourcesController.updateResource
);

// [DELETE] RESOURCE
router.delete(
  "/resources/:id",
  passport.authenticate("jwt", { session: false }),
  ResourcesController.deleteResource
);

// REORDER MODULES
router.put(
  "/reorder/resources",
  passport.authenticate("jwt", { session: false }),
  UpdateResourcesController.reorderModules
);

module.exports = router;
