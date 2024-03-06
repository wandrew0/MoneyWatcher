const Alert = require("./../models/alert_model");

exports.get_alerts = async (req, res) => {
    try {
        console.log(req.body);
        const alertId = req.body == null ? {} : req.body["alertId"];
        if (alertId != null) {
            console.log(alertId);
        }
        let alerts = [];
        if (alertId != null) {
            alerts.push(await Alert.findById(alertId));
        } else {
            alerts = await Alert.find({ user_uuid: req.customer.uuid }).sort({trigger_date: -1});
        }
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


