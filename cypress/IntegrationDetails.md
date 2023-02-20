// example of curl taking from https://docs.getxray.app/display/XRAYCLOUD/Authentication+-+REST+v2
// client_id & client_secret generated in Jira / XRAY application / API Keys.
// client_id & client_secret could be generated for each user.

// My data from Jira:
// "client_id": "1049FF0BADCA46988CEDCB8A1A3105BF", 
// "client_secret":"cd59c9fe3bdcccbf7bb1e919dea076492857caf1f07d81ec256b55321e37ab88"

// The following CURL works on MAC and does not on Windows:

// roman@Romans-MBP hw27 % curl -H "Content-Type: application/json" -X POST --data '{ "client_id": "1049FF0BADCA46988CEDCB8A1A3105BF","client_secret": "cd59c9fe3bdcccbf7bb1e919dea076492857caf1f07d81ec256b55321e37ab88" }'  https://xray.cloud.getxray.app/api/v2/authenticate
// curl output:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOiI4NzgwNGY4OC00OGVjLTMzZDYtYTVkMi02OWRjZjA1YjBmNDgiLCJhY2NvdW50SWQiOiI2MmJkYmQxMjJiNmU0ZGRiYTExNTAyYmIiLCJpc1hlYSI6ZmFsc2UsImlhdCI6MTY3Njg4MTg0OCwiZXhwIjoxNjc2OTY4MjQ4LCJhdWQiOiIxMDQ5RkYwQkFEQ0E0Njk4OENFRENCOEExQTMxMDVCRiIsImlzcyI6ImNvbS54cGFuZGl0LnBsdWdpbnMueHJheSIsInN1YiI6IjEwNDlGRjBCQURDQTQ2OTg4Q0VEQ0I4QTFBMzEwNUJGIn0.2J2fNCg90VVNMHZrLm1jAO6UMH3nkFh2wQ4Fuo4VtCk"%
