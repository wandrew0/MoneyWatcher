const Category = require("./../models/category_model");
const Merchant = require("./../models/merchant_model");

exports.get_categories = async (req, res) => {
    try {
        const categories = {};
        // categories.custom = (await Category.find({ user_uuid: req.customer.uuid })).map((cat) => cat.name);
        categories.plaid = {};
        categories.custom = new Set();
        const merchants = await Merchant.find({ user_uuid: req.customer.uuid });
        for (const merchant of merchants) {
            if (merchant.primary != "CUSTOM") {
                if (!categories.plaid.hasOwnProperty(merchant.primary)) {
                    categories.plaid[merchant.primary] = new Set();
                }
                categories.plaid[merchant.primary].add(merchant.detailed);
            } else if (merchant.primary == "CUSTOM") {
                categories.custom.add(merchant.detailed);
            }
        }

        for (const pr in categories.plaid) {
            categories.plaid[pr] = [...categories.plaid[pr]];
        }

        categories.custom = [...categories.custom];

        res.status(200).json({
            status: "success",
            data: categories
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.get_custom = async (req, res) => {
    try {
        const categories = {};
        categories.custom = (await Category.find({ user_uuid: req.customer.uuid })).map((cat) => cat.name);
        console.log(req.customer.uuid);
        res.status(200).json({
            status: "success",
            data: categories
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.create_category = async (req, res) => {
    try {
        const category = await Category.create({ user_uuid: req.customer.uuid, name: req.body.name });

        res.status(201).json({
            status: "success",
            data: category
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}