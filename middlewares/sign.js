/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const moment = require('moment');
const query = require('../utils/pool');
const sign = {};
exports.sign = sign;

// 获取签到规则列表
sign.list = function(req, res, next) {
  const sql = `SELECT * FROM sign order by sort`;
  console.info("查询签到列表", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 用户签到
sign.do = async function(req, res, next) {
  const user_id = req.body.user_id;
  // 本次签到积分
  const sign_score = req.body.sign_score;
  // 签到id
  const sign_id = req.body.sign_id;
  // 上次签到次数
  let sign_count = req.body.sign_count;
  // 上次签到时间
  const now = new Date().getTime();
  const sign_at = req.body.sign_at; // 如果为null，则说明没签过到days < 1为false

  // 判断此用户今天是否已签到过
  const checkResult = await query(`select sign_at from users where id=${user_id}`);
  if (!checkResult.fail && checkResult instanceof Array) {
    if(!isNaN(checkResult[0].sign_at) && moment(new Date(+checkResult[0].sign_at)).isSame(moment(), 'day')) {
      return res.json({ code: '10001', message: '今天已签到，明天再来吧', success: false, data: '' });
    }
  }

  // 现在和上次签到时间相差的天数
  const start = moment(moment(new Date(+sign_at), 'YYYY-MM-DD')).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const end = moment(moment(new Date(), 'YYYY-MM-DD'));
  const days = end.diff(start, 'days');
  console.info('距离上次签到天数', days);
  if (days < 1) {
    return res.json({ code: '10001', message: '今天已签到，明天再来吧', success: false, data: '' });
  }
  const sql = `begin;
               update users set 
               ${days > 1 ? `sign_count=1` : `sign_count=sign_count+1`},
               sign_at='${now}',
               score=score+${sign_score} where id=${user_id};
               insert into score_stream(business_id,type,score,balance,user_id,is_income,created_at,remark) 
               values(${sign_id},1,${sign_score},(select score from users where id=${user_id}),${user_id},1,'${now}','签到');
               commit;`;
  console.info("用户签到", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body = {
        data: {
          sign_at: now,
          sign_count: days > 1 ? 1 : (+sign_count + 1),
        },
        code: '10000',
        message: '操作成功',
        success: true,
      }
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err });
    }
  })
}

// 添加签到规则
sign.add = function(req, res, next) {
  const sort = req.body.sort;
  const name = req.body.name;
  const score = req.body.score;
  const sql = `insert into sign(sort,name,score)
               values(${sort},'${name}',${score})`;
  console.info("新增签到规则", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的签到规则`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 更新签到规则
sign.update = function(req, res, next) {
  const id = req.body.id;
  const sort = req.body.sort;
  const name = req.body.name;
  const score = req.body.score;
  const sql = `update sign set sort=${sort},name='${name}',score=${score} where id=${id}`;
  console.info("更新签到规则", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `修改了ID为${id}的签到规则`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: message }); 
    }
  })
}

// 删除签到规则
sign.remove = function(req, res, next) {
  const id = req.body.id;
  const sql = `delete from sign where id=${id}`;
  console.info("删除签到规则", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了ID为${id}的签到规则`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: message }); 
    }
  })
}