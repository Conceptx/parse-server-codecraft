const google = require('googleapis');
const express = require('express');
const router = express.Router();
const fs = require('fs');

let privatekey = require('./.credentials/auth.json');
// configure a JWT auth client
let jwtClient = new google.google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/calendar']
);
//authenticate request
jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Successfully connected!');
  }
});

router.get('/', (req, res) => {
  let calendar = google.google.calendar({ version: 'v3', auth: jwtClient });
  calendar.events.list(
    {
      calendarId: '13loc4apis@gmail.com',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    },
    function(err, response) {
      if (err) {
        console.log(err);
        return;
      } else {
        fs.writeFileSync(
          'calendar.js',
          JSON.stringify({ data: response.data.items }),
          { encoding: 'utf8', flag: 'w' },
          err => {
            console.log(err);
            return res.send({ success: false });
          }
        );
        res.status(200).send({ data: response.data.items });
      }
    }
  );
});

module.exports = router;
