const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const customer_router = require("./routes/customer_routes");
const transaction_router = require("./routes/transaction_routes");
const merchant_router = require("./routes/merchant_routes");
const rule_router = require("./routes/rule_routes");
const item_router = require("./routes/item_routes");
const category_router = require("./routes/category_routes");
const alert_router = require("./routes/alert_routes");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json());
app.use(cors());

app.use(`/api/${process.env.VERSION}/customer`, customer_router);
app.use(
    `/api/${process.env.VERSION}/transaction`,
    transaction_router
);
app.use(`/api/${process.env.VERSION}/merchant`, merchant_router);
app.use(`/api/${process.env.VERSION}/rule`, rule_router);
app.use(`/api/${process.env.VERSION}/item`, item_router);
app.use(`/api/${process.env.VERSION}/category`, category_router);
app.use(`/api/${process.env.VERSION}/alert`, alert_router);

module.exports = app;
