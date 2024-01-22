const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });

const app = require("./app");

mongoose.connect(process.env.DATABASE).then(con => {
    console.log("db connection successful");
    // reset();
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
    console.log(`Running on port ${process.env.PORT}`);
});
