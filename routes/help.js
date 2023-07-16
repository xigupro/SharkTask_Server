const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { help } = require('../middlewares/help.js');

router.post('/list', help.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/typeList', help.typeList, function(req, res, next) {
  res.json(req.body);
});

router.post('/detail', login.check, help.detail, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, help.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/update', login.check, help.update, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', login.check, help.remove, log.add, function(req, res, next) {
  res.json(req.body);
});

// 删除分类
router.post('/removeType', login.check, help.removeType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 添加分类
router.post('/addType', login.check, help.addType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 更新分类
router.post('/updateType', login.check, help.updateType, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
