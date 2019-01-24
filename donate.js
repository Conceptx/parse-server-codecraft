const express = require('express');
const router = express.Router();
const request = require('superagent');
const Paynow = require('paynow');

const paynow = new Paynow(
  `${process.env.PAYNOWID}`,
  `${process.env.PAYNOWKEY})`,
  'https://parse-server-me.herokuapp.com/',
  'https://parse-server-me.herokuapp.com/'
);

router.post('/', (req, res) => {
  request
    .post('https://parse-server-me.herokuapp.com/parse/classes/donations')
    .set('Content-Type', 'application/json')
    .set('X-Parse-Application-Id', `${process.env.APP_ID}`)
    .type('json')
    .send(req.body)
    .then(async resp => {
      // if (response.body.code) {
      //   console.log(response.body.error);
      //   return;
      // }
      console.log('Response: ' + resp.body);
      if (req.body.paymentMethod === 'paynow') {
        console.log('Paynow: ' + paynow);
        const payment = paynow.createPayment(req.body.purpose);

        payment.add('FUNDS', req.body.amount);
        console.log('Payment: ' + payment);

        paynow.send(payment).then(ress => {
          if (ress.success) {
            // Get the link to redirect the user to, then use it as you see fit
            let link = ress.redirectUrl;
            console.log(link);
            return res.redirect(link);
          } else {
            return res.json({ success: false });
          }
        });
      } else if (req.body.paymentMethod === 'paypal') {
        return res.json({ success: true });
      }
    })
    .catch(error => console.log(error));
});

module.exports = router;
