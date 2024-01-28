# moneywatcher
## Description
MoneyWatcher is a web application that tracks and monitors a user's bank transactions by integrating with Plaid API in the backend. When a user first signs up with MoneyWatcher, it redirects the user to Plaid to sign in to the user's bank accounts and obtain the user's bank access token. After that, MoneyWatcher calls Plaid's sync API to periodically pull account transactions into MoneyWatcher's DB and start to monitor the user's bank transactions.
* merchants

  A charge transaction has a merchant name and a personal finance category associated with the merchant name. MoneyWatcher extracts these fields (merchant name, merchant category) to create the Merchant object for the user. Users can see all the merchants' information from which they have purchased. Additionally, users can create a new category or modify an existing category that a merchant belongs to.
* reports

  MoneyWatcher supports two types of transaction reports. 
  * retrieve all transactions from date X to date Y. 
  * retrieve all transactions from date X to date Y for merchant category Z.
* rules and alerts

  Users can define monitoring rules with MoneyWatcher. A rule specifies the spending limit L within a period of X number of days and an optional category O. Whenever MoneyWatcher receives new bank transactions, it checks against the rules that the user has defined. If any rule is violated, it triggers an email alert and displays it in the UI.

## Architecture
MoneyWatcher is built with the MERN stack. The backend server is implemented using Node.js and Express.js. It manages data in MongoDB and exposes its functionalities through REST API. I built a simple React-based UI to communicate with the server.

## Dependencies
without Docker: Node.js, npm, and MongoDB

with Docker: Docker
## Build
`npm install`
## Config
The backend code references environment variables set in `api/config.env.template`. If you wish to run moneywatcher locally, please `cp api/config.env.template api/config.env` and set the appropriate values in config.env.
```
NODE_ENV=development # not really used
PORT=3000 # api port
VERSION=v1
DATABASE=mongodb://localhost:27017/moneywatcher # mongodb address
PLAID_CLIENT_ID=OMITTED #   *****REQUIRED***** plaid client id, setup instructions: https://plaid.com/docs/quickstart/
PLAID_SECRET=OMITTED #   *****REQUIRED***** plaid secret, setup instructions: https://plaid.com/docs/quickstart/
PLAID_URL=sandbox.plaid.com # plaid sandbox url
SYNC_INTERVAL_SECONDS=5 # update interval 
JWT_SECRET=OMITTED # set to what you want your jwt secret to be
JWT_EXPIRES_IN=90d
EMAIL_SERVICE=gmail # MoneyWatcher uses [nodemailer](https://nodemailer.com). not necessary for core functions
EMAIL=OMITTED # sender email address
EMAIL_PASSWORD=OMITTED # some services are finnicky and require special setup, not just your regular password
```
## Run (no Docker)
**WARNING:** MoneyWatcher will NOT run properly without environment variables PLAID_CLIENT_ID and PLAID_SECRET set in `/api/config.env` 

First, make sure that your local mongod process is a replica set. Official instructions are [here](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set). Depending on your local setup (ie using `brew services` instead of `mongod` directly), it can require other methods. 

Before running any of the javascript code, make sure that your environment variables in `/api/config.env` are set to valid values. Depending on the provider, email may require special setup to work properly. 

`npm run api` for the api on port 3000 

`npm run frontend` (in a new terminal) for the frontend on port 3001, which should automatically open your browser. If it doesn't, navigate to http://localhost:3001.

## Run (with Docker)
**WARNING:** MoneyWatcher will NOT run properly without environment variables PLAID_CLIENT_ID and PLAID_SECRET set in `/api/config.env` 

The included Dockerfile, start.sh, and following instructions build and run a standalone container with the frontend, api, and MongoDB layers all together. The frontend and api will be exposed, but not MongoDB. 

To build and run MoneyWatcher in a Docker container locally, please follow the steps below.

`cp api/config.env.template api/config.env` 

change the appropriate configuration values in config.env according to your local environment, including PLAID_CLIENT_ID and PLAID_SECRET


`docker build . --tag moneywatcher` builds the image and tags it with moneywatcher:latest

`docker run -d -p 3000:3000 -p 3001:3001 moneywatcher:latest` runs the image and exposes the api and frontend ports

You will be able to connect to localhost:3000 for the UI and localhost:3001 for the API backend.
