# moneywatcher
## Dependencies
without Docker: Node.js, npm, and MongoDB

with Docker: Docker
## Build
`npm install`
## Config
The backend code references environment variables set in `/api/config.env`, but they are not included in this repo as they include access tokens and other sensitive data. Here is a template with some fields ommitted: 
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
## Run (no Docker)
First, make sure that your local mongod process is a replica set. Official instructions are [here](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set). Depending on your local setup (ie using `brew services` instead of `mongod` directly), it can require other methods. 

Before running any of the javascript code, make sure that your environment variables in `/api/config.env` are set to valid values. Depending on the provider, email may require special setup to work properly. 

`npm run api` for the api on port 3000 

`npm run frontend` (in a new terminal) for the frontend on port 3001, which should automatically open your browser. If it doesn't, navigate to http://localhost:3001.

## Run (with Docker)
The included Dockerfile, start.sh, and following instructions build and run a standalone container with the frontend, api, and MongoDB layers all together. The frontend and api will be exposed, but not MongoDB. 

`docker build . --tag moneywatcher` builds the image and tags it with moneywatcher:latest

`docker run -d -p 3000:3000 -p 3001:3001 moneywatcher:latest` runs the image and exposes the api and frontend ports
