const express = require('express');
const router = express.Router();
const request = require('superagent');
const Paynow = require('paynow');

router.post('/', (req, res) => {
  const { name, email, purpose, amount, paymentMethod } = req.body;
  request
    .post('https://lttzw.herokuapp.com/parse/classes/donations')
    .set('Content-Type', 'application/json')
    .set('X-Parse-Application-Id', 'parse-ltt-app-ID')
    .type('json')
    .send(req.body)
    .then(async resp => {
      if (paymentMethod === 'paynow') {
        let paynow = new Paynow(
          '6102',
          '0da3ebc4-7d51-44c1-b92d-4a938ac4f593',
          'https://lttzw.herokuapp.com/',
          'https://lttzw.herokuapp.com/'
        );
        let payment = paynow.createPayment(purpose, '');
        payment.add('FUNDS', amount);

        paynow.send(payment).then(ress => {
          if (ress.success) {
            let link = ress.redirectUrl;
            return res.redirect(link);
          } else {
            return res.json({ success: false });
          }
        });
      }
    })
    .catch(error => console.log(error));
});

module.exports = router;
