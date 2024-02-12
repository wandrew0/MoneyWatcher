const Alert = require("./../models/alert_model");

exports.get_alerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ user_uuid: req.customer.uuid }).sort({trigger_date: -1});

        res.status(200).json({
            status: "success",
            data: alerts
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};
