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
      personalizations: [
        {
          to: [
            {
              email: '13loc4apis@gmail.com',
              name: 'Let Them Trust Inquiry'
            }
          ],
          dynamic_template_data: {
            email: email,
            message: message
          }
        }
      ],
      from: {
        email: 'theophilusokoye@outlook.com',
        name: 'Let Them Trust Inquiry'
      },
      template_id: `${process.env.INQUIRY_TEMPLATE_ID}`
    })
    .then(response => res.json({ success: true }))
    .catch(error => console.log(error));
});

module.exports = router;
