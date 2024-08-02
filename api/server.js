const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });

const app = require("./app");
const logger = require("./utils/logger");

mongoose.connect(process.env.DATABASE).then(con => {
    logger.info("db connection successful");

});

function reset() {
    const db = mongoose.connection.db;
    db.listCollections().toArray().then((collections) => {
        collections
            .map((collection) => collection.name)
            .forEach(async (collectionName) => {
                db.dropCollection(collectionName);
            });
    });
}

app.listen(process.env.PORT, () => {
    logger.info(`Running on port ${process.env.PORT}`);
});
