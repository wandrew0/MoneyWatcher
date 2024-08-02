const logger = require("../utils/logger");
const Rule = require("./../models/rule_model");


exports.get_rules = async (req, res) => {
    try {
        const rules = await Rule.find({ user_uuid: req.customer.uuid });

        res.status(200).json({
            status: "success",
            data: rules
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.create_rule = async (req, res) => {
    try {
        const new_rule = await Rule.create({
            user_uuid: req.customer.uuid,
            ...req.body
        });

        new_rule.alert();

        res.status(201).json({
            status: "success",
            data: new_rule
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.delete_rule = async (req, res) => {
    try {
        await Rule.deleteOne({
            user_uuid: req.customer.uuid,
            name: req.body.name
        });

        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.update_rule = async (req, res) => {
    try {
        res.status(200).json({
            stauts: "success",
            data: "unimplemented"
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            mesage: err.message
        });
    }
};
