const express = require("express");
const transaction_controller = require("./../controllers/transaction_controller");
const { protect } = require("./../controllers/customer_controller");

const router = express.Router();

router
    .route("/")
    .post(protect, transaction_controller.get_transactions);


router
    .route("/get_by_ids")
    .post(protect, transaction_controller.get_transactions_by_ids);

module.exports = router;
