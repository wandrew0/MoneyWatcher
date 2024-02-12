const express = require("express");
const category_controller = require("../controllers/category_controller");
const { protect } = require("../controllers/customer_controller");

const router = express.Router();

router
    .route("/get")
    .post(protect, category_controller.get_categories);

router
    .route("/get_custom")
    .post(protect, category_controller.get_custom);

router
    .route("/create")
    .post(protect, category_controller.create_category);

module.exports = router;
