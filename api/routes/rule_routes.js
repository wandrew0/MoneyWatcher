const express = require("express");
const rule_controller = require("./../controllers/rule_controller");
const { protect } = require("./../controllers/customer_controller")

const router = express.Router();

router
    .route("/")
    .post(protect, rule_controller.get_rules);

router
    .route("/create")
    .post(protect, rule_controller.create_rule);

router
    .route("/delete")
    .post(protect, rule_controller.delete_rule);

module.exports = router;