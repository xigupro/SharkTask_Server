const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { entries } = require('../middlewares/entries.js');

router.post('/list', entries.get, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, entries.add, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, entries.update, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, entries.remove, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
