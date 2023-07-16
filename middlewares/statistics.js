/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const statistics = {};
exports.statistics = statistics;

// 统计当前用户各个状态的任务数量
statistics.getTaskCount = function(req, res, next) {
  console.info("统计当前用户各个状态的任务数量");
  // 用户ID查询条件
  const userId = req.body.userId;
  // 发布人ID查询条件
  const creatorId = req.body.creatorId;
  // 任务状态查询条件
  const taskStatus = req.body.taskStatus;
  const sql = `SELECT COUNT(*) FROM user_tasks where deleted=0 and ${creatorId?`created_by=${creatorId}`:`user_id=${userId}`}${taskStatus ? ` and status = ${taskStatus}` : ''};`
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      console.info('统计当前用户各个状态的任务数量', vals)
      if (req.body.data instanceof Object) {
        req.body.data.taskCount = vals[0]['COUNT(*)']
      } else {
        req.body.data = {
          taskCount: vals[0]['COUNT(*)']
        }
      }
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
// 统计当前用户指定状态下任务的总金额
statistics.getMoneyByTaskStatus = function(req, res, next) {
  console.info("统计当前用户指定状态下任务的总金额");
  // 用户ID查询条件
  const userId = req.body.userId;
  // 发布人ID查询条件
  const creatorId = req.body.creatorId;
  // 任务状态查询条件
  let taskStatus = req.body.taskStatus;
  taskStatus = taskStatus.split(',');
  let taskStatusSql = '';
  if (taskStatus.length > 1){
    // 如果是数组，即查询多个状态下的数据
    taskStatusSql = ' and (';
    taskStatus.map((item, index)=>{
      const isLastOne = index === taskStatus.length-1;
      taskStatusSql += `status = ${item} ${isLastOne ? '' : 'or '}`
    });
    taskStatusSql += ')';
  } else {
    // 只有一个元素的数组
    taskStatusSql = ` and status = ${taskStatus[0]}`;
  }

  const sql = `select sum(money)
               from user_tasks where  
               ${creatorId?`created_by=${creatorId}`:`user_id=${userId}`} and deleted=0
               ${taskStatusSql}`
  console.info(sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      console.info('统计当前用户未完成任务的总金额', vals)
      if (req.body.data instanceof Object) {
        req.body.data.money = vals[0]['sum(money)']
      } else {
        req.body.data = {
          money: vals[0]['sum(money)']
        }
      }
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
// 统计当前用户金额数据
statistics.getUserMoneyStatistics = function(req, res, next) {
  const userId = req.body.userId;
  const sql = `select sum(money) from money_stream where user_id=${userId} and type=1;
               select sum(money) from money_stream where user_id=${userId} and type=4;
               select sum(money) from money_stream where user_id=${userId} and type=3;
               select sum(money) from withdraw_money where status=2 and user_id=${userId};
               select sum(account_amount) from users where id=${userId};
               select sum(money) from money_stream where user_id=${userId} and type=3 and DATE_FORMAT(FROM_UNIXTIME(created_at/1000),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
               select sum(money) from money_stream where user_id=${userId} and type=3 and DATEDIFF(now(), FROM_UNIXTIME(created_at/1000)) = 1;
               select sum(money) as totalTaskIncome from user_tasks where user_id=${userId} and status=3;
               select sum(money) as totalTaskExpend from user_tasks where created_by=${userId} and status=3;`
  query(sql, (err, vals, fields) => {
    if (!err && vals instanceof Array) {
      console.info('获取用户金额数据返回', vals);
      req.body.data = {
        taskTotalRechargeSum: +vals[0][0]['sum(money)'],  // 总充值金额
        taskTotalPaySum: +vals[1][0]['sum(money)'],  // 总发放佣金
        totalIncomeSum: +vals[2][0]['sum(money)'],  // 总收入佣金
        withdrawTotalMoney: +vals[3][0]['sum(money)'],  // 总提现金额
        userTotalMoney: +vals[4][0]['sum(account_amount)'],  // 未提现总金额
        todayIncomeSum: +vals[5][0]['sum(money)'],  // 今天收益
        yesterdayIncomeSum: +vals[6][0]['sum(money)'],  // 昨天收益
        totalTaskIncome: +vals[7][0]['totalTaskIncome'],  // 总获得的任务佣金
        totalTaskExpend: +vals[8][0]['totalTaskExpend'],  // 总发放的任务佣金，不含服务费
      };
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      console.info('获取用户金额数据出错', err);
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}
// 获取任务完成最多的十个用户
statistics.getUserRankList = function(req, res, next) {
  query( `select u.id,u.nick_name,u.avatar,u.username,count(t.task_id) as task_count 
          from users u left join user_tasks t on t.user_id = u.id 
          where t.status = 3 and t.deleted=0 group by u.id order by task_count desc limit 10`,
          (err, vals, fields) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
};
// 获取邀请最多的十个用户
statistics.getInviteRankList = function(req, res, next) {
  query( `select count(u.id) as count,u.inviter,s.avatar,s.username,s.nick_name from users u left join users s on s.id=u.inviter where u.inviter is not null GROUP BY u.inviter order by count desc limit 10`,
          (err, vals, fields) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
};

// 获取后台仪表盘统计
statistics.getDashboardData = function(req, res, next) {
  const sql = `select count(*) from user_reviews where status=1 and deleted=0 and task_creator in (select id from administrators);
               select count(*) from withdraw_money where status=1;
               select count(*) from users where DATE_FORMAT(FROM_UNIXTIME(created_at/1000),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
               select count(*) from user_reviews where status=2 and deleted=0 and DATE_FORMAT(FROM_UNIXTIME(updated_at/1000),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
               select sum(t.money) from user_reviews u left join user_tasks t on t.task_id = u.task_id where u.status=2 and u.deleted=0 and u.task_creator in (select id from administrators) and DATE_FORMAT(FROM_UNIXTIME(u.updated_at/1000),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
               select count(*) from users where deleted=0;
               select count(*) from tasks where deleted=0;
               select sum(t.money) from user_reviews u left join user_tasks t on t.task_id = u.task_id where u.status=2 and u.deleted=0 and u.task_creator in (select id from administrators);
               select sum(money) from withdraw_money where status=2;
               select sum(account_amount) from users;
               select count(*) from user_tasks where status=3 and deleted=0;
               select count(*) from user_tasks where status=1 and deleted=0;
               select count(*) from user_tasks where status=2 and deleted=0;
               select count(*) from user_tasks where status=4 and deleted=0;
               select count(*) from user_tasks where status=5 and deleted=0;
               select count(*) from user_tasks where deleted=0;
               select count(*) from certifications where status=0;
               select count(*) from users where deleted=0 and is_vip=1;
               select sum(money) from money_stream where is_income=1;
               select count(*) from tasks where status=3 and deleted=0;
               select sum(service_price) from tasks where DATE_FORMAT(FROM_UNIXTIME(created_at/1000),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
               select sum(account_amount+finished_amount+withdraw_amount) from users;
               select sum(money) from money_stream where is_income=0;
               select count(*) from users where is_certified=1;
               select sum(score) from users;`;
  query(sql, (err, vals, fields) => {
    if (!err && vals instanceof Array) {
      console.info('获取数据统计返回', vals);
      req.body.data = {
        taskTobeReviewCount: +vals[0][0]['count(*)'],  // 任务待审核数
        withdrawTobeReviewCount: +vals[1][0]['count(*)'],  // 提现待审核数
        todayNewUserCount: +vals[2][0]['count(*)'],  // 今日新增用户数
        todayTaskFinishCount: +vals[3][0]['count(*)'],  // 今日完成任务数
        todayTaskPaySum: +vals[4][0]['sum(t.money)'],  // 官方今日发放佣金
        userTotalCount: +vals[5][0]['count(*)'],  // 用户总数
        taskTotalCount: +vals[6][0]['count(*)'],  // 任务总数
        taskTotalPaySum: +vals[7][0]['sum(t.money)'],  // 官方总发放佣金
        withdrawTotalMoney: +vals[8][0]['sum(money)'],  // 总提现金额
        userTotalMoney: +vals[9][0]['sum(account_amount)'],  // 未提现总金额
        finishTaskTotalCount: +vals[10][0]['count(*)'],  // 完成任务总数
        onGoingTaskCount: +vals[11][0]['count(*)'],  // 进行中的任务总数
        onReviewingTaskCount: +vals[12][0]['count(*)'],  // 审核中的任务总数
        expiredTaskCount: +vals[13][0]['count(*)'],  // 过期的任务总数
        rejectTaskCount: +vals[14][0]['count(*)'],  // 审核失败的任务总数
        grabTaskCount: +vals[15][0]['count(*)'],  // 领取的任务总数
        certificationTobeReviewCount: +vals[16][0]['count(*)'],  // 认证待审核数量
        vipUserTotalCount: +vals[17][0]['count(*)'],  // 会员总数
        totalIncome: +vals[18][0]['sum(money)'],  // 平台总收入
        onSellReviewCount: +vals[19][0]['count(*)'],  // 待审核上架
        todayServicePrice: +vals[20][0]['sum(service_price)'],  // 今日任务佣金
        totalMoney: +vals[21][0]['sum(account_amount+finished_amount+withdraw_amount)'],  // 平台总金额(包括已提现，提现中，用户账户中)
        totalOutcome: +vals[22][0]['sum(money)'],  // 平台总支出
        totalCertifiedUser: +vals[23][0]['count(*)'],  // 总实名认证人数
        totalUserScore: +vals[24][0]['sum(score)'],  // 平台总积分
      };
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      console.info('获取数据统计出错', err);
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}