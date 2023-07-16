const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { statistics } = require('../middlewares/statistics.js');

// 统计当前用户各个状态的任务数量
router.post('/getTaskCount', statistics.getTaskCount, function(req, res, next) {
  res.json(req.body);
});

// 统计当前用户指定状态下任务的总金额
router.post('/getMoneyByTaskStatus', statistics.getMoneyByTaskStatus, function(req, res, next) {
  res.json(req.body);
});

// 统计当前用户金额数据
router.post('/getUserMoneyStatistics', statistics.getUserMoneyStatistics, function(req, res, next) {
  res.json(req.body);
});

// 用户任务完成排行榜
router.post('/getUserRankList', statistics.getUserRankList, function(req, res, next) {
  res.json(req.body);
});

// 用户邀请排行榜
router.post('/getInviteRankList', statistics.getInviteRankList, function(req, res, next) {
  res.json(req.body);
});

// 获取后台仪表盘统计
router.post('/getDashboardData', login.check, statistics.getDashboardData, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
