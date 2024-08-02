const mongoose = require("mongoose");
const Transaction = require("./transaction_model");
const Merchant = require("./merchant_model");
const Alert = require("./alert_model");
const email = require("../utils/email");
const Writable = require('stream');
const logger = require("../utils/logger");

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
        start = start.toISOString().split("T")[0];
        start =
            this.last_triggered && this.last_triggered > start
                ? this.last_triggered
                : start;
        let transactions = await Transaction.find({
            user_uuid: this.user_uuid,
            date: { $gte: start }
        });
        //console.log("rule category:" + this.category);
        if (this.category) {
            const merchants = {};
            const merchant_list = await Merchant.find({
                user_uuid: this.user_uuid
            });
            for (const merchant of merchant_list) {
                merchants[merchant.name] = merchant;
                logger.debug(merchants[merchant.name].detailed);
            }
            transactions = transactions.filter(
                (transaction) =>
                    merchants[transaction.name].detailed === this.category
            )
        }
        const total = transactions.reduce(
            (acc, transaction) => acc + parseFloat(transaction.amount),
            0
        );
        
        if (total > this.limit) {
            let today = new Date();
            today = today.toISOString().split("T")[0];
            this.last_triggered = today;
            await this.save();
            let transIdList = [];
            transactions.forEach(one => {
                transIdList.push(one.transaction_id);
            })
            let transInString = JSON.stringify(transIdList);
            const alert = await Alert.create({
                user_uuid: this.user_uuid,
                name: this.name,
                category: this.category,
                limit: this.limit,
                email: this.email,
                days: this.days,
                trigger_date: today,
                total: total,
                trans: transInString,
            });
            // console.log("alert id:" + alert._id);
            // console.log(sub);
            let sub = "An alert was triggered for Rule Name:" + this.name;
            let alertUrl = process.env.URL + "/Alert?id=" + alert._id;
            logger.debug(alertUrl);
            email.emailHtml(
                this.email,
                sub,
                "<b>Rule Name: " + this.name + "</b></br>" +
                "<h4>Spending limit: " + this.limit + "</h4>" +
                "<h4>Days: " + this.days + "</h4>" +
                "<h4>Merchant Type: " + (this.category ? this.category : 'ALL') + "</h4>" +
                "<h4>An alert was just created. Click <a href=" + alertUrl + ">here </a>" +
                " for its detail. </h4>"


                
            );
        }
    } catch (err) {
        throw err;
    }
};

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
