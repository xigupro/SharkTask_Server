const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { log } = require('../middlewares/log.js');
const { tasks } = require('../middlewares/tasks.js');
const { money } = require('../middlewares/money.js');
const { messages } = require('../middlewares/messages.js');

// 获取任务，不返回下架的
router.post('/', tasks.updateAutoend, tasks.getAll, function(req, res, next) {
  res.json(req.body);
});

// 获取任务，下架的也返回
router.post('/admin', tasks.getAllUnlimited, function(req, res, next) {
  res.json(req.body);
});

// 抢任务
router.post('/grab', login.check, tasks.isVip, tasks.detail, tasks.grab, function(req, res, next) {
  res.json(req.body);
});

// 查询单个任务，带判断是否已抢
router.post('/detailForUser', tasks.updateTimeoutTask, tasks.getDetail, function(req, res, next) {
  res.json(req.body);
});

// 用户领取的任务详情(任务快照)
router.post('/userTaskDetail', tasks.updateTimeoutTask, tasks.userTaskDetail, function(req, res, next) {
  res.json(req.body);
});

// 获取任务提交审核的步骤
router.post('/getReviewStep', tasks.getReviewStep, function(req, res, next) {
  res.json(req.body);
});

// 获取任务提交审核的字段
router.post('/getReviewField', tasks.getReviewField, function(req, res, next) {
  res.json(req.body);
});

// 获取任务审核列表
router.post('/getReviewList', tasks.getReviewList, function(req, res, next) {
  res.json(req.body);
});

// 获取申诉列表
router.post('/getAppealList', tasks.getAppealList, function(req, res, next) {
  res.json(req.body);
});

// 驳回审核请求
router.post('/reviewReject', login.check, tasks.reviewReject, messages.add, log.add, function(req, res, next) {
  res.json(req.body);
});

// 删除提交的审核
router.post('/reviewRemove', login.check, tasks.reviewRemove, log.add, function(req, res, next) {
  res.json(req.body);
});

// 通过审核请求
router.post(
  '/reviewResolve',
  login.check,
  tasks.money,
  tasks.reviewResolve,
  messages.add,
  money.add,
  log.add,
  function(req, res, next) {
    res.json({
      data: true,
      code: '10000',
      message: '操作成功',
      success: true
    });
  }
);

// 获取当前任务审核列表
router.post('/getTaskGrabList', tasks.getTaskGrabList, function(req, res, next) {
  res.json(req.body);
});

// 获取当前用户参与的任务
router.post('/getUserTasks', login.check, tasks.getUserTasks, function(req, res, next) {
  res.json(req.body);
});

// 回收任务数量
router.post('/updateTimeoutTask', login.check, tasks.updateTimeoutTask, function(req, res, next) {
  res.json(req.body);
});

// 处理审核超时的任务
router.post('/updateReviewTimeoutTask',
  login.check,
  tasks.money,
  tasks.updateReviewTimeoutTask,
  money.add,
  function(req, res, next) {
    res.json({
      data: true,
      code: '10000',
      message: '操作成功',
      success: true
    });
  },
);


// 获取当前用户发布的任务
router.post('/getUserPublishedTasks', login.check, tasks.getUserPublishedTasks, function(req, res, next) {
  res.json(req.body);
});

// 获取任务类型
router.post('/getTypes', tasks.getTypes, function(req, res, next) {
  res.json(req.body);
});

// 用户提交任务审核
router.post('/submitReview', login.check, tasks.submitReview, messages.add, function(req, res, next) {
  res.json({
    data: req.body.data,
    message: '操作成功',
    code: '10000',
    success: true
  });
});

// 用户提交申诉
router.post('/addAppeal', login.check, tasks.addAppeal, function(req, res, next) {
  res.json(req.body);
});

// 申诉详情
router.post('/getAppeal', login.check, tasks.getAppeal, function(req, res, next) {
  res.json(req.body);
});

// 更新申诉
router.post('/updateAppeal', login.check, tasks.updateAppeal, log.add, function(req, res, next) {
  res.json(req.body);
});

// 用户修改任务审核
router.post('/updateReview', login.check, tasks.updateReview, function(req, res, next) {
  res.json(req.body);
});

// 删除任务
router.post('/remove', login.check, tasks.remove, log.add, function(req, res, next) {
  res.json(req.body);
});

// 管理员发布任务
router.post('/adminAdd', login.check, tasks.add, log.add, function(req, res, next) {
  res.json(req.body);
});

// 用户发布任务
router.post('/add', login.check, tasks.add, function(req, res, next) {
  res.json(req.body);
});

// 更新任务
router.post('/update', login.check, tasks.update, log.add, function(req, res, next) {
  res.json(req.body);
});

// 根据ID获取审核的任务
router.post('/getReviewDetail', tasks.getReviewDetail, function(req, res, next) {
  res.json(req.body);
});

// 根据ID获取审核详情，用户端审核
router.post('/getReviewDetailForUser', tasks.getReviewDetailForUser, function(req, res, next) {
  res.json(req.body);
});

// 根据任务ID获取任务详情
router.post('/getDetail', tasks.detail, function(req, res, next) {
  res.json(req.body);
});

// 修改任务状态
router.post('/updateStatus', login.check, tasks.updateStatus, messages.add, log.add, function(req, res, next) {
  res.json(req.body);
});

// 删除分类
router.post('/removeType', login.check, tasks.removeType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 添加分类
router.post('/addType', login.check, tasks.addType, log.add, function(req, res, next) {
  res.json(req.body);
});

// 更新分类
router.post('/updateType', login.check, tasks.updateType, log.add, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
