const https = require("https");

const auth = {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET
}

function https_post({ body, ...options }) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            ...options,
        }, res => {
            const chunks = [];
            res.on("data", data => chunks.push(data));
            res.on("end", () => {
                let res_body = Buffer.concat(chunks);
                switch (res.headers["content-type"]) {
                    case "application/json":
                        res_body = JSON.parse(res_body);
                        break;
                }
                resolve(res_body);
            });
        });
        req.on("error", reject);
        if (body) {
            req.write(body);
        }
        req.end();
    });
};

exports.get_accounts = async (token) => {
    try {
        const data = JSON.stringify({
            ...auth,
            access_token: token
        });
        // const data = JSON.stringify({
        //     client_id: process.env.PLAID_CLIENT_ID,
        //     secret: process.env.PLAID_SECRET,
        //     access_token: token
        // });
        const accounts = JSON.parse((await https_post({
            hostname: process.env.PLAID_URL,
            path: "/accounts/get",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            },
            body: data
        })).toString());

        return accounts
    } catch (err) {
        throw err;
    }
}

exports.get_institution_name = async (id) => {
    try {
        const data = JSON.stringify({
            ...auth,
            institution_id: id,
            country_codes: ["US"]
        });
        const institution_name = JSON.parse((await https_post({
            hostname: process.env.PLAID_URL,
            path: "/institutions/get_by_id",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            },
            body: data
        })).toString());

        return institution_name;
    } catch (err) {
        throw err;
    }
}

exports.get_transactions_page = async (token, count, cursor) => {
    try {
        const data = JSON.stringify({
            ...auth,
            access_token: token,
            count: count,
            ...cursor && { cursor: cursor }
        });
        const transactions_page = JSON.parse((await https_post({
            hostname: process.env.PLAID_URL,
            path: "/transactions/sync",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            },
            body: data
        })).toString());

        return transactions_page;
    } catch (err) {
        throw err;
    }
}

exports.get_all_transactions = async (token, cursor) => {
    try {
        let page = await this.get_transactions_page(token, 500, cursor);
        const transactions_list = page["added"];

        while (page["has_more"] === true) {
            page = await this.get_transactions_page(token, 500, page["next_cursor"]);
            transactions_list.push(...page["added"]);
        }
        // if (!page["next_cursor"]) {
        //     console.log(cursor);
        //     console.log(page);
        // } else {
        //     console.log(cursor);
        // }

        return { next_cursor: page["next_cursor"], transactions: transactions_list };
    } catch (err) {
        throw err;
    }
}