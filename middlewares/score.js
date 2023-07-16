/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const score = {};
exports.score = score;

// 给用户加减积分
score.add = function(req, res, next) {
  const user_id = req.body.user_id;
  const score = req.body.score || 0;
  // 积分获得来源。1签到；2发任务；3完成任务；4实名认证；5加入会员；6充值；7平台赠送/扣除；8转盘
  const type = req.body.type;
  const remark = req.body.remark || '';
  const created_at = new Date().getTime();
  const is_income = score > 0;
  const sql = `begin;
               update users set score=score+${score} where id=${user_id};
               insert into score_stream(type,score,balance,user_id,is_income,created_at,remark) 
               values(${type},${Math.abs(score)},(select score from users where id=${user_id}),${user_id},${is_income},'${created_at}','${remark}');
               commit;`
  console.info("加积分", sql);
  query(sql, (err, vals) => {
    console.info('加积分返回', vals)
    if (!err && vals instanceof Array) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `给ID为${user_id}的用户${is_income ? '发放' : '扣除'}了${score}积分`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 获取用户积分流水
score.stream = function(req, res, next) {
  var param = req.body;
  //分页实现
  var currentPage = 1; //默认为1
  var size = 10; //每页条数
  if (param.page) {
    currentPage = parseInt(param.page);
  }
  if (param.size) {
    size = parseInt(param.size);
  }
  //设置最后一页页码
  var lastPage = currentPage - 1;
  //假如目前仅有一页，则最后一页则为1
  if (currentPage <= 1) {
    lastPage = 1;
  }
  //如果需要下一页，则开启
  //var nextPage = currentPage + 1;
  var offset = (currentPage - 1) * size;

  const type = param.type;
  const userId = param.userId;
  const isSearch = type || userId;
  let filters = [];
  type && filters.push(`type=${type}`);
  userId && filters.push(`user_id=${userId}`);
  filters = isSearch ? filters.join(' and ') : '';

  var sql = `SELECT COUNT(*) FROM score_stream where ${filters};
            select * FROM score_stream where ${filters} 
            order by created_at desc limit ${size} offset ${offset}`;

  console.info('查询用户积分流水', sql);;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      const totalCount = vals[0][0]['COUNT(*)'];
      const totalPage = Math.ceil(parseInt(totalCount) / size);
      req.body.data = {
        list: vals[1],
        size: size,
        page: currentPage,
        totalPage: totalPage,
        totalCount: totalCount,
      };
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err.message,
        success: false,
        data: err,
      });
    }
  });
}

// 获取转盘列表
score.getLuckyDrawList = async function(req, res, next) {
  const sql = `SELECT * FROM lucky_draw order by sort desc`;
  const result = await query(sql, null, null, '查询转盘列表');
  if (!result.fail && result instanceof Array) {
    req.body.data = result;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
}