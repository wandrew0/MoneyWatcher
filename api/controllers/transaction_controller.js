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
        for(const merchant of merchant_list) {
            merchants[merchant.name] = merchant;
        }

        for (const transaction of transactions) {
            transaction["category"] = merchants[transaction.name];
            transaction["amount"] = parseFloat(transaction.amount)
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
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}