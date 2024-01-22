const mongoose = require("mongoose");
const plaid = require("./../utils/plaid");

const x = new mongoose.Decimal128("1.1");

const transaction_schema = new mongoose.Schema({
    user_uuid: { type: String, required: true },
    item_token: { type: String, required: true },
    account_id: { type: String, required: true },
    amount: { type: mongoose.Decimal128, required: true },
    // categories: [String],
    date: { type: String, required: true },
    iso_currency_code: { type: String, required: true },
    merchant_name: String,
    name: { type: String, required: true },
    logo_url: String,
    // enrich_category: {
    //     detailed: String,
    //     primary: String
    // },
    transaction_id: { type: String, required: true }
});

transaction_schema.index({ user_uuid: 1, date: -1, account_id: 1, transaction_id: 1 }, { unique: true });

const Transaction = mongoose.model("Transaction", transaction_schema);

module.exports = Transaction;