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
        const merchants = await Merchant.findOneAndUpdate({ user_uuid: req.customer.uuid }, {
            $set: {
                [`merchants.${req.body["merchant"]}`]: {
                    primary: req.body["primary"],
                    detailed: req.body["detailed"]
                }
            }
        }, {
            new: true
        });

        res.status(200).json({
            status: "success",
            data: merchants["merchants"]
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}