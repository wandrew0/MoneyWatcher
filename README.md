# moneywatcher
## Dependencies
node, npm, and mongodb
## Build
`npm install`
## Run
`npm run api` for the api on port 3000 (requires mongo to be running already)
`npm run start` for the frontend on port 3001
## Config
The backend code references environment variables set in /api/config.env, but they are not included in this repo as they include access tokens and other sensitive data. Here is a template with some fields ommitted: 
```
NODE_ENV=development
PORT=3000
VERSION=v1
DATABASE=mongodb://localhost:27017/moneywatcher
PLAID_CLIENT_ID=OMITTED
PLAID_SECRET=OMITTED
PLAID_URL=sandbox.plaid.com
SYNC_INTERVAL_SECONDS=5
JWT_SECRET=OMITTED
JWT_EXPIRES_IN=90d
EMAIL_SERVICE=gmail
EMAIL=OMITTED
EMAIL_PASSWORD=OMITTED
```
