const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { score } = require('../middlewares/score.js');

router.post('/stream', score.stream, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, score.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/getLuckyDrawList', login.check, score.getLuckyDrawList, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
