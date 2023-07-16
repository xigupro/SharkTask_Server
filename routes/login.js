const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { sms } = require('../middlewares/sms.js');

router.post('/', login.miniProgramLogin, login.createUserFromMiniProgram, function(req, res) {
  res.json(req.body);
});

router.post('/ips', login.check, login.ips, function(req, res) {
  res.json(req.body);
});

// 绑定公众号微信用户
router.post('/bindOfficialAccount', login.officialAccountLogin, login.getWechatUserInfo, login.bindWechat, function(req, res) {
  res.json(req.body);
});

router.post('/officialAccountLogin', login.officialAccountLogin, login.getWechatUserInfo, login.createUserFromOfficialAccount, function(req, res) {
  res.json(req.body);
});

router.post('/getAccessToken', login.getAccessToken, function(req, res) {
  res.json(req.body);
});

router.post('/checkWechatIsNew', login.checkWechatIsNew, function(req, res) {
  res.json(req.body);
});

router.post('/checkAppleIsNew', login.checkAppleIsNew, function(req, res) {
  res.json(req.body);
});

router.post('/checkPhoneIsNew', sms.check, login.checkPhoneIsNew, function(req, res) {
  res.json(req.body);
});

router.post('/phoneLogin', sms.check, login.createUserFromPhoneLogin, function(req, res) {
  res.json(req.body);
});

router.post('/bindPhoneAndLogin', sms.check, login.bindPhoneAndLogin, function(req, res) {
  res.json(req.body);
});

router.post('/bindPhoneByToken', sms.check, login.bindPhoneByToken, function(req, res) {
  res.json(req.body);
});

router.post('/unbindPhone', login.check, login.unbindPhone, function(req, res) {
  res.json(req.body);
});

router.post('/admin', login.admin, log.add, function(req, res) {
  res.json(req.body);
});

router.post('/bindWechat', login.bindWechat, function(req, res) {
  res.json(req.body);
});

router.post('/bindApple', login.bindApple, function(req, res) {
  res.json(req.body);
});

router.post('/wechat', login.createUserFromAPPWeChatLogin, function(req, res) {
  res.json(req.body);
});

router.post('/apple', login.createUserFromAPPAppleLogin, function(req, res) {
  res.json(req.body);
});

router.post('/web', login.web, function(req, res) {
  res.json(req.body);
});



module.exports = router;
