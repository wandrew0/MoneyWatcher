const mongoose = require("mongoose");

const alert_schema = new mongoose.Schema({
    user_uuid: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: String,
    limit: { type: Number, required: true },
    email: String,
    days: { type: Number, required: true },
    trigger_date: { type: String, required: true },
    total: { type: Number, required: true }
});

alert_schema.index({ user_uuid: 1, trigger_date: -1 });

const Alert = mongoose.model("Alert", alert_schema);

module.exports = Alert;
