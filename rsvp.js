const express = require('express');
const router = express.Router();
const request = require('superagent');

router.post('/', (req, res) => {
  request
    .post('https://lttzw.herokuapp.com/parse/classes/rsvp')
    .set('X-Parse-Application-Id', 'parse-ltt-app-ID')
    .set('X-Parse-Revocable-Session', `1`)
    .type('json')
    .send(req.body)
    .then(response =>
      response.body.code
        ? res.json({ success: false })
        : res.redirect('/events')
    )
    .catch(error => console.log(error));
});

module.exports = router;
