const express = require('express');
const router = express.Router();
const request = require('superagent');
const Paynow = require('paynow');

router.post('/', (req, res) => {
  const { name, email, purpose, amount, paymentMethod } = req.body;
  request
    .post('https://parse-server-me.herokuapp.com/parse/classes/donations')
    .set('Content-Type', 'application/json')
    .set('X-Parse-Application-Id', `${process.env.APP_ID}`)
    .type('json')
    .send(req.body)
    .then(async resp => {
      if (paymentMethod === 'paynow') {
        let paynow = new Paynow(
          `${process.env.PAYNOWID}`,
          `${process.env.PAYNOWKEY})`,
          'https://parse-server-me.herokuapp.com/'
        );
        let payment = paynow.createPayment(purpose, '');
        payment.add('FUNDS', amount);

        paynow.send(payment).then(ress => {
          console.log(ress);
          if (ress.success) {
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
