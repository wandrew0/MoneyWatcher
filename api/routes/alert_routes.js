const express = require("express");
const alert_controller = require("../controllers/alert_controller");
const { protect } = require("../controllers/customer_controller");

const router = express.Router();

router.route("/get").post(protect, alert_controller.get_alerts);

module.exports = router;
