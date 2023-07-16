const express = require('express');
const router = express.Router();
const { exportFile } = require('../middlewares/export');
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { money } = require('../middlewares/money.js');

router.post('/add', login.check, money.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/reduce', login.check, money.reduce, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/stream', login.check, money.stream, function(req, res, next) {
  res.json(req.body);
});

router.post('/exportAll', login.check, money.exportAll, exportFile.excel, function(req, res, next) {
  res.json(req.body);
});



module.exports = router;
