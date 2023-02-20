// example of curl taking from https://docs.getxray.app/display/XRAYCLOUD/Authentication+-+REST+v2
// client_id & client_secret generated in Jira / XRAY application / API Keys.
// client_id & client_secret could be generated for each user.

curl -H "Content-Type: application/json" -X POST --data '{ "client_id": "1049FF0BADCA46988CEDCB8A1A3105BF","client_secret": "cd59c9fe3bdcccbf7bb1e919dea076492857caf1f07d81ec256b55321e37ab88" }'  https://xray.cloud.getxray.app/api/v2/authenticate