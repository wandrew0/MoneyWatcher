# PlaidTestAccount

A simple java program to create Plaid sandbox test user accounts.
https://dashboard.plaid.com/developers/sandbox

Each sandbox account can be created with <= 250 transactions and is created with a user name.
To obtain an access token, use the Plaid API, to use that user name.

#) set the desired value in config.json and run this java tool with config.json file
#) it will generate a json file that contains test transactions.
#) go to plaid sandbox test page, and create a test account user, {test user} with the transaction json file.
#) use plaid's sandbox API sandbox/public_token/create to obtain a public token, with override_user = {test user}
#) call item/public_token/exchange to obtain an access token


# Generated access tokens
First Platypus Bank	ins_109508
access-sandbox-fcf2f7bb-01b1-4d94-89a5-0b1afc329526
access-sandbox-169e790f-d12d-43d7-b8ea-c01c5fbbfc76

#
access-sandbox-cdd388bb-bcbe-4e47-8c1d-3b038388e7c6
access-sandbox-328e07a2-5124-4bfb-813b-0c3e5b0cda83




First Gingham Credit Union	ins_109509
access-sandbox-f3197c8a-5d90-4040-aebc-cdb96fd92fcf
access-sandbox-139aebe7-a0b9-4073-9c0b-5afe7974ad5a
#
access-sandbox-32c34bd6-3631-4235-9af4-d12c6b1e1ada
access-sandbox-02d1485a-fe33-43f5-9e31-d440ffb018c0



Tattersall Federal Credit Union	ins_109510
access-sandbox-9cacf6a9-2bd7-4681-a423-d16ff577e2d2
access-sandbox-bc86482d-fe4b-4b8a-a39a-2d3b891fa9fc

#
access-sandbox-c03b9e87-b447-470c-852a-9331b042f1e6
access-sandbox-d72725d7-62f2-4ce5-8df4-28eface4722d

Tartan Bank	ins_109511
access-sandbox-caebe736-3b32-47aa-b2b8-4eaa5486221d
access-sandbox-b8cae433-eaee-466f-b066-acfc1c339f99

#
access-sandbox-d760517c-8df1-4973-a195-77557b256224
access-sandbox-e1aa5a3e-a98a-471e-9185-46a5cce8a668

Houndstooth Bank	ins_109512

Tartan-Dominion Bank of Canada	ins_43
Flexible Platypus Open Banking (UK Bank)	ins_116834
Royal Bank of Plaid (UK Bank)	ins_117650





