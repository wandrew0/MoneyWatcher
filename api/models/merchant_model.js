const mongoose = require("mongoose");

const merchant_schema = new mongoose.Schema({
    user_uuid: { type: String, required: true },
    // merchants: {
    //     type: Map,
    //     of: {
    //         primary: String,
    //         detailed: String
    //     },
    //     default: {}
    // }
    name: { type: String, required: true },
    primary: { type: String, required: true },
    detailed: { type: String, required: true }
})

// user_uuid
// name
// primary
// detailed

// user_uuid, name

merchant_schema.index({ user_uuid: 1, name: 1 }, { unique: true });

const Merchant = mongoose.model("Merchant", merchant_schema);

module.exports = Merchant;