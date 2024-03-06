const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../app");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.email = async (to, subject, text) => {
    try {
        if (to) {
            const options = {
                from: process.env.EMAIL,
                to: to,
                subject: subject,
                text: text
            }
            const res = await transporter.sendMail(options);
            // console.log(res);
        } else {
            console.log(subject);
        }
    } catch (err) {
        throw err;
    }
}

exports.emailHtml = async(to, subject, htmlText) => {
    try {
        if (to) {
            const options = {
                from: process.env.EMAIL,
                to: to,
                subject: subject,
                html : htmlText
            }
            const res = await transporter.sendMail(options);
        } else {
            console.log("no email address");
        }
    } catch (err) {
        throw err;
    }
}