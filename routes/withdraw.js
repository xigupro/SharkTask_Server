const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { exportFile } = require('../middlewares/export.js');
const { withdraw } = require('../middlewares/withdraw.js');
const { user } = require('../middlewares/user.js');
const { messages } = require('../middlewares/messages.js');
const { order } = require('../middlewares/order.js');
const wepay = require('../utils/wepay');

// 用户提现
router.post('/submit', login.check, user.info, withdraw.submit, function(req, res, next) {
  res.json({
    data: req.body.data,
    message: '操作成功',
    code: '10000',
    success: true
  });
});
// 用户提现列表
router.post('/list', withdraw.list, function(req, res, next) {
  res.json(req.body);
});
// 导出提现列表
router.post('/exportAll', withdraw.exportAll, exportFile.excel, function(req, res, next) {
  res.json(req.body);
});
// 用户提现详情
router.post('/detail', withdraw.detail, function(req, res, next) {
  res.json(req.body);
});
// 用户提现驳回
router.post('/reject', login.check, withdraw.reject, messages.add, log.add, function(req, res, next) {
  res.json(req.body);
});
// 用户提现通过，付款到微信方式
router.post('/resolve', login.check, wepay.wxcompay, withdraw.resolve, messages.add, log.add, function(req, res, next) {
  res.json(req.body);
});
// 用户提现通过，付款到支付宝方式
router.post('/resolveByAlipay', login.check, order.alipayPayToAccount, withdraw.resolve, messages.add, log.add, function(req, res, next) {
  res.json(req.body);
});
module.exports = router;