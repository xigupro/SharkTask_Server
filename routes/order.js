const express = require('express');
var xmlparser = require('express-xml-bodyparser');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { system } = require('../middlewares/system.js');
const { order } = require('../middlewares/order.js');
const { user } = require('../middlewares/user.js');

router.post('/getDetail', order.getDetail, function(req, res, next) {
  res.json(req.body);
});

// 充值
router.post('/rechargeMoney', 
  login.check,
  system.get,
  order.rechargeMoney,
  order.session,
  order.add,
  function(req, res, next) {
    res.json(req.body);
});

// 充值支付回调
router.post('/rechargeMoneyNotify',
  xmlparser({ trim: false, explicitArray: false }),
  order.rechargeMoneyNotify,
  function(req, res, next) {
    res.json(req.body);
});

// APP下单接口
router.post('/appAdd', 
  login.check,
  order.appAdd,
  function(req, res, next) {
    res.json(req.body);
});

// 公众号获取openid
router.post('/publicSession', 
  login.check,
  order.officialSession,
  function(req, res, next) {
    res.json(req.body);
});

// 公众号下单接口
router.post('/publicAdd', 
  login.check,
  order.publicAdd,
  function(req, res, next) {
    res.json(req.body);
});

// 支付宝下单接口
router.post('/alipayAdd', 
  login.check,
  order.alipayAdd,
  function(req, res, next) {
    res.json(req.body);
});

// 支付宝充值支付回调
router.post('/alipayRechargeNotify',
  order.alipayRechargeNotify,
  function(req, res, next) {
    res.json(req.body);
});

// 接收闲玩订单
router.get('/xianwan',
  order.xianwan,
  function(req, res, next) {
    res.json(req.body);
});

// 接收鱼玩订单
router.post('/yuwan',
  order.yuwan,
  function(req, res, next) {
    res.json(req.body);
});

// 接收多游订单
router.get('/duoyou',
  order.duoyou,
  function(req, res, next) {
    res.json(req.body);
});

// 发红包订单
router.post('/redAdd', 
  login.check,
  user.info,
  order.red,
  function(req, res, next) {
    res.json(req.body);
});

// 获取红包订单详情
router.post('/redDetail', 
  login.check,
  order.redDetail,
  function(req, res, next) {
    res.json(req.body);
});

// 领取红包
router.post('/redReceive', 
  login.check,
  order.redReceive,
  function(req, res, next) {
    res.json(req.body);
});

module.exports = router;
