const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { system } = require('../middlewares/system.js');

// 获取系统配置
router.post('/get', system.get, function(req, res, next) {
  res.json(req.body);
});

// 更新系统配置
router.post('/update', login.check, system.update, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
