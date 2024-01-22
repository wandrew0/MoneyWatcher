const Rule = require("./../models/rule_model");

exports.get_rules = async (req, res) => {
    try {
        const rules = await Rule.findOne({ user_uuid: req.customer.uuid });

        res.status(200).json({
            status: "success",
            data: rules["rules"]
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.create_rule = async (req, res) => {
    try {
        const { name, ...fields } = req.body;
        const rules = await Rule.findOne({ user_uuid: req.customer.uuid });
        if (rules["rules"]["categorical"].has(name)) {
            throw new Error("duplicate name");
        }
        const new_rules = await Rule.findOneAndUpdate({ user_uuid: req.customer.uuid }, {
            $set: {
                [`rules.categorical.${name}`]: fields
            }
        }, {
            new: true
        });

        new_rules.alert();

        res.status(201).json({
            status: "success",
            data: new_rules["rules"]
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.update_rule = async (req, res) => {
    try {
        const { name, ...fields } = req.body;
        const rules = await Rule.findOne({ user_uuid: req.customer.uuid });
        if (rules["rules"]["categorical"].has(name)) {
            throw new Error("duplicate name");
        }
        const updated_rules = await Rule.findOneAndUpdate({ user_uuid: req.customer.uuid }, {
            $set: {
                [`rules.categorical.${name}`]: fields
            }
        }, {
            new: true
        });
        res.status(200).json({
            stauts: "success",
            data: updated_rules["rules"]
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            mesage: err.message
        });
    }
}