const oPayController = require("../controllers/opay.controllers");

const express = require("express");

const router = express.Router();

//ROUTING
router.post("/opay-payment", oPayController.OPayPaymentFunction);

module.exports = router;

// module.exports = {
//   SendNotification,
// };
