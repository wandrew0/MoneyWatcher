const express = require("express");
const customer_controller = require("./../controllers/customer_controller");

const router = express.Router();

router
    .route("/")
    .get(customer_controller.get_all_customers)

router
    .route("/signup")
    .post(customer_controller.create_customer);

router
    .route("/login")
    .post(customer_controller.login);

router
    .route("/bank")
    .post(customer_controller.protect, customer_controller.get_customer_banks);

router
    .route("/update")
    .post(customer_controller.update_all);

router
    .route("/item")
    .post(customer_controller.protect, customer_controller.add_item);

module.exports = router;