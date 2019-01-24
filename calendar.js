const express = require('express');
const router = express.Router();
const { listEvents } = require('./events');

router.get('/', (req, res) => {
  listEvents().then(events => console.log(events));
});

router.get('/:query', (req, res) => {});

module.exports = router;
