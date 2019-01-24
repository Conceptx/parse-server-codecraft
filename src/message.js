const express = require('express');
const router = express.Router();
const request = require('superagent');

router.post('/', (req, res) => {
  const { name, companyName, email, message } = req.body;
  request
    .post('https://api.sendgrid.com/v3/mail/send')
    .set('content-type', 'application/json')
    .set('authorization', `Bearer ${process.env.SENDGRID}`)
    .type('json')
    .send({
      email,
      message
    })
    .then(response => res.json({ success: true }))
    .catch(error => console.log(error));
});

module.exports = router;
