const mongoose = require("mongoose");
const Merchant = require("./merchant_model");
const Transaction = require("./transaction_model");
const plaid = require("../utils/plaid");
const logger = require("../utils/logger");

const item_schema = new mongoose.Schema({
    user_uuid: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    cursor: {
        type: String,
        default: ""
    },
    accounts: [{
        account_id: String,
        mask: String,
        name: String,
        official_name: String,
        subtype: String,
        type: { type: String }
    }]
})

item_schema.statics.sync = async function (uuid) {
    try {
        const items = await Item.find({ user_uuid: uuid });
        const promises = [];
        for (const item of items) {
            promises.push(item.sync());
        }
        await Promise.all(promises).catch();
        return uuid;
    } catch (err) {
        // console.log(uuid);
        throw err;
    }
}

item_schema.methods.sync = async function () {
    const merchants = {}; // merchants["name"]...
    try {
        await mongoose.connection.transaction(async (session) => {
            const cursor = this.cursor;
            this.cursor = "LOCK " + new mongoose.Types.ObjectId(); // unique
            await this.save({ session }); // begin lock
            const institution_id_accounts = await plaid.get_accounts(this.access_token);
            if (institution_id_accounts["error_type"]) {
                throw new Error(institution_id_accounts["error_message"]);
            }
            const institution_name = await plaid.get_institution_name(institution_id_accounts["item"]["institution_id"]);
            this.institution_id = institution_id_accounts["item"]["institution_id"];
            this.institution_name = institution_name["institution"]["name"];
            this.accounts = institution_id_accounts["accounts"].map((account) => {
                delete account["balances"];
                return account;
            });
            const { next_cursor, transactions } = await plaid.get_all_transactions(this.access_token, cursor);
            if (!next_cursor) {
                logger.info(this.user_uuid);
            }
            this.cursor = next_cursor;
            await this.save({ session });
            const promises = [];
            for (const transaction of transactions) {
                const trans_obj = {
                    user_uuid: this.user_uuid,
                    item_token: this.access_token,
                    account_id: transaction["account_id"],
                    amount: transaction["amount"],
                    date: transaction["date"],
                    iso_currency_code: transaction["iso_currency_code"],
                    name: transaction["name"],
                    ...transaction["logo_url"] && { logo_url: transaction["logo_url"] },
                    transaction_id: transaction["transaction_id"]
                };
                promises.push(Transaction.create([trans_obj], { session }));
                // do merchant
                let exists = await Merchant.exists({ user_uuid: this.user_uuid, name: transaction["name"] }).session(session);
                exists = exists || merchants.hasOwnProperty(transaction["name"]);
                if (!exists) {
                    merchants[transaction["name"]] = {
                        user_uuid: this.user_uuid,
                        name: transaction["name"],
                        primary: transaction["personal_finance_category"]["primary"],
                        detailed: transaction["personal_finance_category"]["detailed"],
                    };
                }
            }
            await Promise.all(promises);
        });
    } catch (err) {
        // console.log(this);
        throw err;
    }


    // create the merchants 
    for (const name of Object.keys(merchants)) {
        Merchant.create([merchants[name]]).catch((err) => logger.warn("ignored error: {err}"));
    }
}

item_schema.index({ user_uuid: 1, access_token: 1 }, { unique: true });

const Item = mongoose.model("Item", item_schema);

module.exports = Item;