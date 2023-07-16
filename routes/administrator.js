const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { administrator } = require('../middlewares/administrator.js');

router.post('/list', administrator.list, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, administrator.add, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, administrator.update, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, administrator.remove, log.add, function(req, res, next) {
  res.json(req.body);
});
module.exports = router;
