const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { sign } = require('../middlewares/sign.js');

router.post('/list', sign.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/do', login.check, sign.do, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, sign.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/update', login.check, sign.update, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', login.check, sign.remove, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
