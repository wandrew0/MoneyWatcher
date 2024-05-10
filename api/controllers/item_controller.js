const fs = require("fs");
const plaid = require("./../utils/plaid");

const tokens = fs
    .readFileSync(`${__dirname}/../data/tokens.txt`)
    .toString()
    .split(/\s+/)
    .slice(0, -1);

let ret = [];
let lock = false;

exports.get_tokens = async (req, res) => {
    console.log(`${__dirname}/../data/tokens.txt`);
    console.log(tokens);
    try {
        while (lock) {
            await new Promise((r) => setTimeout(r, 500));
        }
        if (ret.length === 0) {
            console.log("caching thingies and setting lock");
            lock = true;
            const newbanks = [];
            for (const token of tokens) {
                console.log("token:" + token);
                const id = (await plaid.get_accounts(token)).item
                    .institution_id;
                const name = (await plaid.get_institution_name(id))
                    .institution.name;
                newbanks.push(name);
            }
            banks = newbanks;
            ret = tokens.map((t, i) => ({
                token: t,
                bank: banks[i]
            }));
            lock = false;
        }
        res.status(200).json({
            status: "success",
            data: ret
        });
    } catch (err) {
        lock = false;
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};
