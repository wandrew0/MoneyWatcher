const express = require("express");
const item_controller = require("./../controllers/item_controller");

const router = express.Router();

router.route("/get_all").post(item_controller.get_tokens);

module.exports = router;
