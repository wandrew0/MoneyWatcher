# PlaidTestAccount

A simple java program to create Plaid sandbox test user accounts.
https://dashboard.plaid.com/developers/sandbox

Each sandbox account can be created with <= 250 transactions and is created with a user name.
To obtain an access token, use the Plaid API, to use that user name.

#) set the desired value in config.json and run this java tool with config.json file
#) it will generate a json file that contains test transactions.
#) go to plaid sandbox test page, and create a test account user, {test user} with the transaction json file.
#) use plaid's sandbox API to obtain an access token, with override_user = {test user}