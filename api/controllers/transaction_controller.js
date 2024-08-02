const logger = require("../utils/logger");
const Transaction = require("./../models/transaction_model");
const Merchant = require("./../models/merchant_model");

exports.get_transactions = async (req, res) => {
    try {
        const pipeline = [{
            $match: {
                user_uuid: req.customer.uuid,
                date: {
                    $gte: req.body["start_date"],
                    $lte: req.body["end_date"]
                },
                ...req.body["account_id"] && { account_id: req.body["account_id"] }
            }
        }, {
            $sort: { user_uuid: 1, date: -1, account_id: 1, transaction_id: 1 }
        }];
        if (req.body["offset"]) {
            pipeline.push({ $skip: req.body["offset"] });
        }
        if (req.body["count"]) {
            pipeline.push({ $limit: req.body["count"] + 1 });
        }
        const transactions = (await Transaction.aggregate(pipeline));
        const merchant_list = await Merchant.find({ user_uuid: req.customer.uuid });

        const merchants = {};
        for (const merchant of merchant_list) {
            merchants[merchant.name] = merchant;
        }

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const category = merchants[transaction.name];
            if (req.body.category && req.body.category !== category.detailed) {
                transactions.splice(i, 1);
                i--;
                continue;
            }

            transaction["category"] = merchants[transaction.name];
            transaction["amount"] = parseFloat(transaction.amount);
        }

        let has_more = false;
        if (transactions.length === req.body["count"] + 1) {
            transactions.pop();
            has_more = true;
        }

        res.status(200).json({
            status: "success",
            data: {
                transactions: transactions,
                has_more: has_more
            }
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}
// requestion body. tranaction_ids : {["id1", "id2"]}
exports.get_transactions_by_ids = async (req, res) => {
    try {
        const transactionIdString = req.body["transaction_ids"];
        const idList = JSON.parse(transactionIdString);
        //idList.forEach(elem => console.log("trans_id" + elem));
        const transactions = await Transaction.find({ 'transaction_id': { $in: idList } });
        const retValues = [];
        for (let i = 0; i < transactions.length; i++) {
            const trans = {};
            trans.amount = parseFloat(transactions[i].amount);
          //  console.log("trans.amount" + trans.amount);
            trans.name = transactions[i].name;
            trans.date = transactions[i].date;

            retValues.push(trans);
        }
        //console.log(retValues);
        res.status(200).json({
            status: "success",
            data : {
                transactions : retValues
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "fail",
            message: error
        });
    }
}

