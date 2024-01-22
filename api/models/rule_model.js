const mongoose = require("mongoose");
const Transaction = require("./transaction_model");
const Merchant = require("./merchant_model");
const email = require("../utils/email");

const rule_schema = new mongoose.Schema({
    user_uuid: { type: String, unique: true, index: true, required: true },
    rules: {
        categorical: {
            type: Map,
            of: {
                limit: { type: Number, required: true },
                email: String,
                days: { type: Number, required: true },
                category: String,
                last_triggered: String
            },
            default: {}
        }
    }
});

rule_schema.methods.alert = async function () {
    try {
        for (const [name, rule] of this.rules.categorical) {
            let start = new Date();
            start.setDate(start.getDate() - rule.days + 1);
            start = start.toISOString().split('T')[0];
            start = rule.last_triggered && rule.last_triggered > start ? rule.last_triggered : start;
            let transactions = await Transaction.find({
                user_uuid: this.user_uuid,
                date: { $gte: start }
            });
            if (rule.category) {
                const merchants = (await Merchant.findOne({ user_uuid: req.customer.uuid })).merchants;
                transactions = transactions.filter((transaction) => merchants.get(transaction.name) === rule.category);
            }
            const total = transactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
            if (total > rule.limit) {
                email.email(rule.email, "over limit", JSON.stringify({
                    rule: name,
                    total: total,
                    transactions: transactions
                }, null, 2));
                let today = new Date();
                today = today.toISOString().split('T')[0];
                rule.last_triggered = today;
                this.rules.set(name, rule);
            }
        }
        await this.save();
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