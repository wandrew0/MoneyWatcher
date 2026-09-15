const assert = require('node:assert/strict');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { after, before, test, mock } = require('node:test');

const logDir = mkdtempSync(path.join(tmpdir(), 'moneywatcher-test-'));
process.env.NODE_ENV = 'test';
process.env.VERSION = 'v1';
process.env.WORK_DIR = logDir;
process.env.JWT_SECRET = 'test-only-secret';
process.env.EMAIL = 'sender@example.test';

// Loading the app normally schedules a daily Plaid sync. Tests must not run it.
const { CronJob } = require('cron');
mock.method(CronJob.prototype, 'start', () => {});

// Exercise real Nodemailer message creation without contacting an SMTP server.
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
const messages = [];
mock.method(nodemailer, 'createTransport', () => ({
    async sendMail(options) {
        const result = await transport.sendMail(options);
        messages.push(result.message.toString());
        return result;
    }
}));

const app = require('../api/app');
const Customer = require('../api/models/customer_model');
const mail = require('../api/utils/email');
const logger = require('../api/utils/logger');
logger.silent = true;

let server;
let origin;
before(async () => {
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    transport.close();
    logger.close();
    mock.restoreAll();
    rmSync(logDir, { recursive: true, force: true });
});

test('login parses JSON and rejects missing credentials without querying MongoDB', async () => {
    const response = await fetch(`${origin}/api/v1/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'person@example.test' })
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { status: 'fail', message: 'missing email or password' });
});

test('protected transaction routes reject missing and invalid JWTs', async () => {
    for (const authorization of ['', 'Bearer invalid-token']) {
        const response = await fetch(`${origin}/api/v1/transaction`, {
            method: 'POST',
            headers: authorization ? { authorization } : {}
        });
        assert.equal(response.status, 400);
        const body = await response.json();
        assert.equal(body.status, 'fail');
        assert.equal(body.message, authorization ? 'jwt malformed' : 'not logged in');
    }
});

test('customer schema defaults and password verification remain compatible', async () => {
    const bcrypt = require('bcryptjs');
    const customer = new Customer({ first_name: 'Test', last_name: 'User', email: 'person@example.test', password: 'test-password' });
    assert.match(customer.uuid, /^[0-9a-f-]{36}$/);
    const hash = await bcrypt.hash('test-password', 4);
    assert.equal(await customer.verify_password('test-password', hash), true);
    assert.equal(await customer.verify_password('wrong-password', hash), false);
    assert.equal(customer.changed_password_after(0), false);
    customer.password_changed_at = new Date('2026-01-01T00:00:00Z');
    assert.equal(customer.changed_password_after(0), true);
});

test('email helpers create text and HTML messages with the upgraded Nodemailer', async () => {
    await mail.email('recipient@example.test', 'Spending alert', 'Limit exceeded');
    await mail.emailHtml('recipient@example.test', 'Spending alert', '<p>Limit exceeded</p>');
    assert.equal(messages.length, 2);
    for (const message of messages) {
        assert.match(message, /To: recipient@example\.test/);
        assert.match(message, /Subject: Spending alert/);
    }
    assert.match(messages[0], /Content-Type: text\/plain/);
    assert.match(messages[0], /Limit exceeded/);
    assert.match(messages[1], /Content-Type: text\/html/);
    assert.match(messages[1], /<p>Limit exceeded<\/p>/);
});
