const express = require('express');
const router = express.Router();
const request = require('superagent');

router.post('/', (req, res) => {
  const { email, password } = req.body;
  request
    .get('https://lttzw.herokuapp.com/parse/login')
    .set('X-Parse-Application-Id', 'parse-ltt-app-ID')
    .set('X-Parse-Revocable-Session', `1`)
    .type('form')
    .send({ email })
    .send({ password })
    .then(response =>
      response.body.code
        ? res.json({ success: false })
        : res.json({ success: true })
    )
    .catch(error => console.log(error));
});

module.exports = router;
