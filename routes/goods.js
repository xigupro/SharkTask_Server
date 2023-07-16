const express = require('express');
const router = express.Router();
const { log } = require('../middlewares/log.js');
const { login } = require('../middlewares/login.js');
const { goods } = require('../middlewares/goods.js');

router.post('/list', goods.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/orders', login.check, goods.orders, function(req, res, next) {
  res.json(req.body);
});

router.post('/exchange', login.check, goods.exchange, function(req, res, next) {
  res.json(req.body);
});

router.post('/orderDetail', login.check, goods.orderDetail, function(req, res, next) {
  res.json(req.body);
});

router.post('/cancelOrder', login.check, goods.cancelOrder, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/deliver', login.check, goods.deliver, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/detail', goods.detail, function(req, res, next) {
  res.json(req.body);
});

router.post('/updateStatus', goods.updateStatus, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, goods.add, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/update', login.check, goods.update, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', goods.remove, log.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/types', goods.types, function(req, res, next) {
  res.json(req.body);
});

// 删除分类
router.post('/removeType', login.check, goods.removeType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 添加分类
router.post('/addType', login.check, goods.addType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 更新分类
router.post('/updateType', login.check, goods.updateType, log.add, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
