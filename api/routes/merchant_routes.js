const express = require("express");
const merchant_controller = require("./../controllers/merchant_controller");
const { protect } = require("./../controllers/customer_controller");

const router = express.Router();

router.route("/").post(protect, merchant_controller.get_merchants);

router
    .route("/update")
    .post(protect, merchant_controller.update_merchants);

module.exports = router;
