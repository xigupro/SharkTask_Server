const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { exportFile } = require('../middlewares/export.js');
const { user } = require('../middlewares/user.js');
const { messages } = require('../middlewares/messages.js');

// 获取用户信息
router.post('/info', login.check, user.info, function(req, res, next) {
  res.json(req.body);
});
// 根据用户ID获取用户信息
router.post('/getInfoByID', login.check, user.getInfoByID, function(req, res, next) {
  res.json(req.body);
});
// 获取用户列表
router.post('/all', login.check, user.all, function(req, res, next) {
  res.json(req.body);
});
// 用户列表导出Excel
router.post('/exportAll', login.check, user.exportAll, exportFile.excel, function(req, res, next) {
  res.json(req.body);
});

// 更新用户
router.post('/update', login.check, user.update, log.add, function(req, res, next) {
  res.json(req.body);
});
// 获取用户等级列表
router.post('/getLevelList', user.getLevelList, function(req, res, next) {
  res.json(req.body);
});
// 更新用户等级
router.post('/updateLevel', login.check, user.updateLevel, log.add, function(req, res, next) {
  res.json(req.body);
});

// 根据手机号重置密码
router.post('/updateUserPassword', user.updateUserPassword, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
