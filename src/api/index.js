const express = require("express");

const usersApi = require("./users");
const loginApi = require("./login");
const forgotPasswordApi = require("./forgot_password");
const subscriptionsApi = require("./subscriptions");
const brandingApi = require("./branding");
const coursesApi = require("./courses");
const modulesApi = require("./modules");
const lessonsApi = require("./lessons");
const resourcesApi = require("./resources");
const timestampsApi = require("./timestamps");
const enrollmentsApi = require("./enrollments");
const notificationsApi = require("./notifications");
const readNotificationsApi = require("./read_notifications");
const oPayApi = require("./opay_route");
const checkOutApi = require("./checkout");
const freeOptInApi = require("./free_opt_ins");

const router = express.Router();

router.use(usersApi);
router.use(loginApi);
router.use(forgotPasswordApi);
router.use(subscriptionsApi);
router.use(brandingApi);
router.use(coursesApi);
router.use(modulesApi);
router.use(lessonsApi);
router.use(resourcesApi);
router.use(timestampsApi);
router.use(enrollmentsApi);
router.use(notificationsApi);
router.use(readNotificationsApi);
router.use(oPayApi);
router.use(checkOutApi);
router.use(freeOptInApi);

module.exports = router;
