const express = require('express');
const router = express.Router();
const request = require('superagent');

router.post('/', (req, res) => {
  const { email, password } = req.body;
  request
    .get('/parse/login')
    .set('X-Parse-Application-Id', `${process.env.APP_ID}`)
    .set('X-Parse-Revocable-Session', `1`)
    .type('form')
    .send({ email })
    .send({ password })
    .then(response =>
      response.body.code === 0
        ? res.json({ success: true })
        : res.json({ success: false })
    )
    .catch(error => console.log(error));
});

module.exports = router;