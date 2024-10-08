const { promisify } = require("util");
const logger = require("../utils/logger");
const Customer = require("./../models/customer_model");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Item = require("../models/item_model");
const { CronJob } = require("cron");

const tokens = fs.readFileSync(`${__dirname}/../data/tokens.txt`).toString().split("\n");

const job = new CronJob(
    "00 00 00 * * *",
    async () => {
        try {
            logger.debug("starting sync");
            await Customer.sync_all();
            await Customer.alert_all();
            logger.debug("finished sync");
        } catch (err) {
            logger.error(err);
        }
    },
    null,
    true,
    "America/Los_Angeles"
);

const sign_token = (uuid) => {
    return jwt.sign({ uuid: uuid }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw new Error("not logged in");
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const customer = await Customer.findOne({
            uuid: decoded.uuid
        });
        if (!customer) {
            throw new Error("user doesn't exist");
        }

        if (customer.changed_password_after(decoded.iat)) {
            throw new Error("password changed");
        }

        req.customer = customer;
        next();
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.add_item = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            uuid: req.customer.uuid
        });

        if (!req.body.access_token) {
            throw new Error("missing access_token");
        }

        if (
            await Item.exists({
                user_uuid: req.customer.uuid,
                access_token: req.body.access_token
            })
        ) {
            logger.warn(
                "uuid:" +
                    req.customer.uuid +
                    " already has access token:" +
                    req.body.access_token
            );
        } else {
            const item = await Item.create({
                user_uuid: req.customer.uuid,
                access_token: req.body.access_token
            });
            item.sync();
        }
        res.status(200).json({
            status: "success",
            data: customer
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // console.log("missing email or password");
            res.status(400).json({
                status: "fail",
                message: "missing email or password"
            });
            return;
        }

        const customer = await Customer.findOne({ email }).select("+password");

        if (!customer || !(await customer.verify_password(password, customer.password))) {
            // console.log("wrong email or password");
            res.status(401).json({
                status: "fail",
                message: "wrong email or password"
            });
            return;
        }

        const token = sign_token(customer.uuid);
        res.status(200).json({
            status: "success",
            token,
            data: customer
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "failure",
            message: err.message
        });
    }
};

exports.create_customer = async (req, res) => {
    try {
        const index = Math.floor(Math.random() * tokens.length);
        const access_token = tokens[index];
        // req.body["items"] = [{ access_token: access_token }];
        const new_customer = await Customer.create(req.body);

        const token = sign_token(new_customer.uuid);

        res.status(201).json({
            status: "success",
            token,
            data: new_customer
        });
        new_customer.sync();
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.get_all_customers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({
            status: "success",
            data: customers
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.get_customer_banks = async (req, res) => {
    try {
        //console.log("get_customer_banks:" + req.customer.uuid);
        const items = await Item.find({
            user_uuid: req.customer.uuid
        });
        //console.log("bank accounts:" + items);
        const banks = items.map((item) => {
            //console.log("one item:" + item.access_token);
            return item.access_token;
        });
        //console.log(banks);
        res.status(200).json({
            status: "success",
            data: banks
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.update_all = async (req, res) => {
    try {
        await Customer.sync_all();
        await Customer.alert_all();
        res.status(200).json({
            status: "success",
            data: {}
        });
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};
