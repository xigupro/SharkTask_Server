const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { certifications } = require('../middlewares/certifications.js');
const { messages } = require('../middlewares/messages.js');

// 获取认证列表
router.post('/get', login.check, certifications.get, function(req, res, next) {
  res.json(req.body);
});
// 获取认证详情
router.post('/detail', login.check, certifications.detail, function(req, res, next) {
  res.json(req.body);
});
// 用户提交认证资料
router.post('/add', login.check, certifications.add, messages.add, function(req, res, next) {
  res.json(req.body);
});
// 管理员审核认证资料
router.post('/review', login.check, certifications.review, log.add, function(req, res, next) {
  res.json(req.body);
});
// 用户更新认证资料
router.post('/update', login.check, certifications.update, function(req, res, next) {
  res.json(req.body);
});
// 删除用户认证资料
router.post('/remove', login.check, certifications.remove, log.add, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
