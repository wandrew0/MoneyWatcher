const mongoose = require("mongoose");
const Transaction = require("./transaction_model");
const Merchant = require("./merchant_model");
const email = require("../utils/email");

const rule_schema = new mongoose.Schema({
    user_uuid: { type: String, required: true },
    name: { type: String, required: true },
    category: String,
    limit: { type: Number, required: true },
    email: String,
    days: { type: Number, required: true },
    last_triggered: String
});

rule_schema.index({ user_uuid: 1, name: 1 }, { unique: true });

rule_schema.methods.alert = async function () {
    try {
        let start = new Date();
        start.setDate(start.getDate() - this.days + 1);
        start = start.toISOString().split('T')[0];
        start = this.last_triggered && this.last_triggered > start ? this.last_triggered : start;
        let transactions = await Transaction.find({
            user_uuid: this.user_uuid,
            date: { $gte: start }
        });
        if (this.category) {
            const merchants = {};
            const merchant_list = await Merchant.find({ user_uuid: req.customer.uuid });
            for (const merchant of merchant_list) {
                merchants[merchants.name] = merchant;
            }
            transactions = transactions.filter((transaction) => merchants[transaction.name].detailed === this.category);
        }
        const total = transactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
        // console.log(total);
        if (total > this.limit) {
            email.email(this.email, "over limit", JSON.stringify({
                rule: this.name,
                total: total,
                transactions: transactions
            }, null, 2));
            let today = new Date();
            today = today.toISOString().split('T')[0];
            this.last_triggered = today;
            await this.save();
        }
    } catch (err) {
        throw err;
    }
}

const Rule = mongoose.model("Rule", rule_schema);

module.exports = Rule;

/*change to
collection
    rule
        name
        user_uuid
        type
        ...fields

user_uuid + name is unique (compound index user_uuid, name)
*/