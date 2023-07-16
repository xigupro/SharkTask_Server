const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { banners } = require('../middlewares/banners.js');

// 获取轮播图
router.post('/', banners.get, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, banners.add, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, banners.update, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, banners.remove, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
