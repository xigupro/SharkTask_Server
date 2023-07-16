const express = require('express');
const router = express.Router();
const { times } = require('../middlewares/times.js');

router.post('/list', times.list, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
