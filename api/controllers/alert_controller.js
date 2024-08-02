const Alert = require("./../models/alert_model");
const logger = require("../utils/logger");

exports.get_alerts = async (req, res) => {
    try {

        logger.debug(req.body);
        const alertId = req.body == null ? {} : req.body["alertId"];
        if (alertId != null) {
            logger.debug(alertId);
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
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};


