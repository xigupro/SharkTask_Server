const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { address } = require('../middlewares/address.js');

router.post('/list', login.check, address.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/detail', login.check, address.detail, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, address.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/update', login.check, address.update, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', login.check, address.remove, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
