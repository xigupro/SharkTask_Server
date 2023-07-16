/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const register = {};
exports.register = register;

register.add = async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const inviter = req.body.inviter || null;
  const createdAt = new Date().getTime();
  // 初始用户赠送的账户金额
  const baseAmountSql = 'select base_amount from system';
  const baseAmountResult = await query(baseAmountSql);
  let baseAmount = 0;
  if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
    baseAmount = baseAmountResult[0].base_amount || 0;
  }
  const sql = `insert into users(username, password, created_at, inviter, task_limit, account_amount, refresh_count)
               values(?,?,?,?, (select task_limit from growth_levels where level=1), ${baseAmount}, (select refresh_count from system))`;
  const sqlValue = [username, password, createdAt, inviter];
  const result = await query(sql, null, sqlValue, '新增用户');
  if (!result.fail && result instanceof Object && result.insertId) {
    if (baseAmount) {
      query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
             values(3,${baseAmount},${baseAmount},${result.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
    }
    req.body.data = result.insertId;
    req.body.userId = inviter;
    req.body.taskType = 5;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    if (result.sqlState === '23000') {
      return res.json({ code: '10007', message: '已存在此用户名，请更换', success: false, data: null }); 
    }
    return res.json({ code: '10001', message: result.sqlMessage, success: false, data: null }); 
  }
}