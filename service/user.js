/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const { MessageService } = require('./message');
const UserService = {};
exports.UserService = UserService;

/**
 * 查询用户信息
 * @param {Number} userId 用户ID
 * @returns Object
 */
UserService.getUserInfo = async function(userId) {
  const userSql = `select * from users where id=${userId}`;
  const userResult = await query(userSql, null, null, '查询用户信息');
  console.info('用户信息', userResult)
  if (!userResult.fail && userResult instanceof Array) {
    return userResult[0] || {}
  }
  return {}
}

/**
 * 查询等级信息
 * @param {Number} level 用户等级
 * @returns 
 */
UserService.getLevelInfo = async function(level) {
  const levelSql = `select * from growth_levels where level=${level}`;
  const levelResult = await query(levelSql, null, null, '查询等级信息');
  console.info('等级信息', levelResult)
  if (!levelResult.fail && levelResult instanceof Array) {
    return levelResult[0] || {}
  }
  return {}
}

/**
 * 给指定用户升级
 * @param {Number} userId 用户ID
 * @returns 
 */
UserService.growthLevel = async function(userId) {
  // 查询用户信息
  const userInfo = await UserService.getUserInfo(userId)
  // 下一等级信息
  const nextLevelInfo = await UserService.getLevelInfo(userInfo.level + 1)

  const taskSql = `SELECT count(*) as task_count FROM user_tasks where user_id=${userId} and status=3`;
  const taskResult = await query(taskSql, null, null, '查询用户已完成任务数');
  console.info('用户已完成任务数', taskResult)
  let taskCount = 0
  if (!taskResult.fail && taskResult instanceof Array && taskResult[0]) {
    taskCount = taskResult[0].task_count
  }

  const inviteSql = `SELECT count(*) as invite_count FROM users where inviter=${userId}`;
  const inviteResult = await query(inviteSql, null, null, '查询用户直属下级数');
  console.info('用户已完成任务数', inviteResult)
  let inviteCount = 0
  if (!inviteResult.fail && inviteResult instanceof Array && inviteResult[0]) {
    inviteCount = inviteResult[0].invite_count
  }

  // 当直属下级数量和已完成任务数满足升级
  if (nextLevelInfo
      && nextLevelInfo.task_count 
      && taskCount >= nextLevelInfo.task_count
      && nextLevelInfo.invite_count 
      && inviteCount >= nextLevelInfo.invite_count ) {
    const growthSql = `update users set level=level+1 where id=${userId}`
    const growthResult = await query(growthSql, null, null, '用户升级')
    console.info('用户升级返回', growthResult)
    if (!growthResult.fail && growthResult instanceof Object && growthResult.affectedRows) {
      // 添加动态

      const { phone, nick_name, username } = userInfo
      await MessageService.addDynamic(`恭喜用户${phone || nick_name || username}成功晋级到${nextLevelInfo.name}`)
    }
  }
}

/**
 * 给用户按等级发放奖金
 */
UserService.sendAward = async function() {
  const sql = `select u.id,u.account_amount,u.level,g.money_monthly from users u left join growth_levels g on u.level=g.level where u.deleted=0 and u.status=1 and g.money_monthly > 0`
  const userResult = await query(sql, null, null, '查询用户等级每月奖励')
  if (!userResult.fail && userResult instanceof Array) {
    userResult.forEach(async (item) => {
      await UserService.addMoney(item.id, item.money_monthly, 3, '发放用户等级奖金')
    })
  }
}

/**
 * 给用户加钱
 * @param {Number} userId 用户ID
 * @param {Number} money 加的金额
 * @param {Number} type 类型，1充值；2提现；3收入；4支出
 * @param {String} remark 备注
 * @returns Boolean
 */
UserService.addMoney = async function(userId, money, type, remark) {
  money = +money
  if (money < 0 || !userId) {
    return false
  }
  const sql = `begin;
               update users set account_amount=account_amount+${money} where id=${userId};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(${type},${money},(select account_amount from users where id=${userId}),${userId},1,'${Date.now()}','${remark}');
               commit;`
  console.info("加钱", sql);
  const addResult = await query(sql, null, null, `给用户${userId}加${money}元，备注:${remark}`)
  return !addResult.fail
}