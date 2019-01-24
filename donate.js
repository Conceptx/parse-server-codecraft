const express = require('express');
const router = express.Router();
const request = require('superagent');
const Paynow = require('paynow');

router.post('/', (req, res) => {
  request
    .post('https://parse-server-me.herokuapp.com/parse/classes/donations')
    .set('Content-Type', 'application/json')
    .set('X-Parse-Application-Id', `${process.env.APP_ID}`)
    .type('json')
    .send(req.body)
    .then(response => {
      // if (response.body.code) {
      //   console.log(response.body.error);
      //   return;
      // }
      console.log('Response: ' + body);
      if (req.body.paymentMethod === 'paynow') {
        const paynow = new Paynow(
          `${process.env.PAYNOWID}`,
          `${process.env.PAYNOWKEY})`,
          'https://parse-server-me.herokuapp.com/',
          'https://parse-server-me.herokuapp.com/'
        );
        console.log('Paynow: ' + paynow);
        const payment = paynow.createPayment(req.body.purpose, req.body.email);
        payment.add('FUNDS', req.body.amount);
        console.log('Payment: ' + payment);
        const init = paynow.send(payment);
        console.log('Init:' + init);
        const link = init.success ? init.redirectUrl : { success: false };
        console.log('Link :' + link);
        return res.redirect(link);
      } else if (req.body.paymentMethod === 'paypal') {
        return res.json({ success: true });
      }
    })
    .catch(error => console.log(error));
});

module.exports = router;
