const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log');
const { messages } = require('../middlewares/messages.js');

router.post('/getNoticeList', messages.getNoticeList, function(req, res, next) {
  res.json(req.body);
});
router.post('/list', messages.list, function(req, res, next) {
  res.json(req.body);
});
router.post('/getDynamicList', messages.getDynamicList, function(req, res, next) {
  res.json(req.body);
});
router.post('/unreadCount', login.check, messages.unreadCount, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, messages.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/addNotice', login.check, messages.addNotice, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/updateNotice', login.check, messages.updateNotice, log.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/getNoticeDetail', login.check, messages.getNoticeDetail, function(req, res, next) {
  res.json(req.body);
});
router.post('/detail', login.check, messages.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/read', login.check, messages.read, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, messages.remove, log.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
