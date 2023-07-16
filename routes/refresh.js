const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { refresh } = require('../middlewares/refresh.js');

router.post('/list', refresh.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, refresh.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/update', login.check, refresh.update, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', login.check, refresh.remove, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/buy', login.check, refresh.buy, function(req, res, next) {
  res.json(req.body);
});

router.post('/do', login.check, refresh.do, function(req, res, next) {
  res.json(req.body);
});

router.post('/recommend', login.check, refresh.recommend, function(req, res, next) {
  res.json(req.body);
});

router.post('/top', login.check, refresh.top, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
