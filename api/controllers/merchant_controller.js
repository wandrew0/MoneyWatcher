const Merchant = require("./../models/merchant_model");

exports.get_merchants = async (req, res) => {
    try {
        const merchants = await Merchant.find({ user_uuid: req.customer.uuid });

        res.status(200).json({
            status: "success",
            data: merchants
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.update_merchants = async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ user_uuid: req.customer.uuid, name: req.body.merchant });
        merchant.primary = req.body.primary;
        merchant.detailed = req.body.detailed;
        await merchant.save();

        res.status(200).json({
            status: "success",
            data: merchant
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}