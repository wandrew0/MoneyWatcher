const mongoose = require("mongoose");

const category_schema = new mongoose.Schema({
    user_uuid: { type: String, required: true },
    name: { type: String, required: true }
})

category_schema.index({ user_uuid: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", category_schema);

module.exports = Category;