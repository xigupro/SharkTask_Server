const express = require('express');
const router = express.Router();
const { sms } = require('../middlewares/sms.js');

router.post('/send', sms.send, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
