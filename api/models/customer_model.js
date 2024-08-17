const mongoose = require("mongoose");
const plaid = require("./../utils/plaid");
const Transaction = require("./transaction_model");
const Merchant = require("./merchant_model");
const Rule = require("./rule_model");
const bcrypt = require("bcryptjs");
const email = require("./../utils/email");
const Item = require("./item_model");
const logger = require("../utils/logger");

const customer_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "A customer must have a first name"]
    },
    last_name: {
        type: String,
        required: [true, "A customer must have a last name"]
    },
    email: {
        type: String,
        required: [true, "A customer must have an email"],
        unique: true,
        index: true
    },
    phone: String,
    password: {
        type: String,
        required: [true, "A customer must have a password"],
        select: false
    },
    uuid: {
        type: String,
        default: () => crypto.randomUUID(),
        unique: true,
        index: true
    },
    // items: [{
    //     access_token: {
    //         type: String,
    //         required: [true, "An item must have an access token"],
    //     },
    //     institution_id: String,
    //     institution_name: String,
    //     cursor: { type: String, default: "" },
    //     accounts: [{
    //         account_id: String,
    //         mask: String,
    //         name: String,
    //         official_name: String,
    //         subtype: String,
    //         type: { type: String }
    //     }]
    // }],
    password_changed_at: Date
});

//remove items from here
//new items model
//sync user (call sync item)
//sync item (mongoose transaction)

customer_schema.path("email").validate(async function (email) {
    if (!this.isNew && !this.isModified("email")) return true;

    try {
        const Customer = mongoose.model("Customer");

        const count = await Customer.countDocuments({ email: email });
        if (count > 0) return false;
        return true;
    } catch (error) {
        return false;
    }
}, "email already exists");

customer_schema.pre("save", async function () {
    if (this.isNew) {
        try {
        } catch (err) {
            throw err;
        }
    } else {
    }
});

customer_schema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

customer_schema.methods.verify_password = async (candidate_password, real_password) => {
    return await bcrypt.compare(candidate_password, real_password);
};

customer_schema.methods.changed_password_after = function (JWTTimestamp) {
    if (this.password_changed_at) {
        const changed_timestamp = parseInt(this.password_changed_at.getTime() / 1000, 10);
        return changed_timestamp > JWTTimestamp;
    }
    return false;
};

customer_schema.methods.sync = async function () {
    try {
        const items = await Item.sync(this.uuid);
        // const merchants = await Merchant.findOne({ user_uuid: this.uuid });
        // let final_map = new Map();
        // for (i = 0; i < this.items.length; i++) {
        //     const item = this.items[i];
        //     const institution_id_accounts = await plaid.get_accounts(item.access_token);
        //     const institution_name = await plaid.get_institution_name(institution_id_accounts["item"]["institution_id"]);
        //     item.institution_id = institution_id_accounts["item"]["institution_id"];
        //     item.institution_name = institution_name["institution"]["name"];
        //     item.accounts = institution_id_accounts["accounts"].map((account) => {
        //         delete account["balances"];
        //         return account;
        //     });
        //     const { next_cursor, map } = await create_transactions(this.uuid, item.access_token, item.cursor);
        //     this.items[i].cursor = next_cursor;
        //     final_map = new Map([...final_map, ...map]);
        // }
        // final_map = new Map([...final_map, ...merchants.merchants.toObject()]);
        // merchants.merchants = final_map;
        // merchants.save();
        // await this.save();
        // return this;
    } catch (err) {
        throw err;
    }
};

customer_schema.statics.sync_all = async function () {
    try {
        const customers = await Customer.find().select("+password");
        const promises = [];
        for (const customer of customers) {
            promises.push(customer.sync());
        }
        await Promise.all(promises);
    } catch (err) {
        throw err;
    }
};

customer_schema.statics.alert_all = async function () {
    try {
        const customers = await Customer.find();
        const promises = [];
        for (const customer of customers) {
            promises.push(customer.alert());
        }
        await Promise.all(promises);
    } catch (err) {
        throw err;
    }
};

customer_schema.methods.alert = async function () {
    try {
        const rules = await Rule.find({ user_uuid: this.uuid });
        const promises = [];
        for (const rule of rules) {
            promises.push(rule.alert());
        }
        await Promise.all(promises);
    } catch (err) {
        throw err;
    }
};

async function create_transactions(user_uuid, item_token, cursor) {
    const { next_cursor, transactions } = await plaid.get_all_transactions(
        item_token,
        cursor
    );
    const map = new Map();
    for (const transaction of transactions) {
        const trans_obj = {
            user_uuid: user_uuid,
            item_token: item_token,
            account_id: transaction["account_id"],
            amount: transaction["amount"],
            // ...transaction["category"] && { categories: transaction["category"] },
            date: transaction["date"],
            iso_currency_code: transaction["iso_currency_code"],
            // ...transaction["merchant_name"] && { merchant_name: transaction["merchant_name"] },
            name: transaction["name"],
            ...(transaction["logo_url"] && { logo_url: transaction["logo_url"] }),
            // ...transaction["personal_finance_category"] && {
            //     enrich_category: {
            //         detailed: transaction["personal_finance_category"]["detailed"],
            //         primary: transaction["personal_finance_category"]["primary"]
            //     }
            // },
            transaction_id: transaction["transaction_id"]
        };
        if (!map.has(transaction["name"])) {
            map.set(transaction["name"], {
                primary: transaction["personal_finance_category"]["primary"],
                detailed: transaction["personal_finance_category"]["detailed"]
            });
            // Merchant.findOneAndUpdate({ user_uuid: user_uuid }, {
            //     $set: {
            //         [`merchants.${transaction["name"]}`]: map.get(transaction["name"])
            //     }
            // });
        }
        Transaction.create(trans_obj).catch((err) =>
            logger.warn("ignored duplicate\n {err}")
        );
    }
    return { next_cursor, map };
}

const Customer = mongoose.model("Customer", customer_schema);

module.exports = Customer;
