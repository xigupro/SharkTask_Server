/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const moment = require('moment');
const query = require('../utils/pool');
const money = {};
exports.money = money;

// 给用户加钱
money.add = function(req, res, next) {
  const userId = req.body.userId || req.body.userId;
  let money = req.body.money || req.body.money || 0;
    money = +money;
  
  // 加钱类型，1充值；2提现；3收入；4支出
  const type = req.body.type;
  const remark = req.body.remark || '';
  const created_at = new Date().getTime();
  if (money < 0) {
    return res.json({ code: '10010', message: '金额不合法', success: false, data: money }); 
  }
  const sql = `begin;
               update users set account_amount=account_amount+${money} where id=${userId};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(${type},${money},(select account_amount from users where id=${userId}),${userId},1,'${created_at}','${remark}');
               commit;`
  console.info("加钱", sql);
  query(sql, (err, vals) => {
    console.info('加钱返回', vals)
    if (!err && vals instanceof Array) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: err }); 
    }
  })
}
// 给用户减钱
money.reduce = function(req, res, next) {
  const userId = req.body.userId || req.body.userId;
  let money = req.body.money || req.body.money || 0;
    money = +money;
  if (money < 0) {
    return res.json({ code: '10010', message: '金额不合法', success: false, data: money }); 
  }
  const remark = req.body.remark;
  const created_at = new Date().getTime();
  const sql = `begin;
               update users set account_amount=account_amount-${money},
               finished_amount=finished_amount+${money} where id=${userId};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(4,${money},(select account_amount from users where id=${userId}),${userId},0,"${created_at}","${remark || ''}");
               commit;`
  console.info("减钱", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `给用户${userId}账户余额减去了${money}元`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 获取用户金额流水
money.stream = function(req, res, next) {
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

  const { type, userId, createDateRange } = param;
  let filters = [];
  type && filters.push(`type=${type}`);
  userId && filters.push(`user_id=${userId}`);
  createDateRange && createDateRange.length === 2 && filters.push(`created_at >= ${createDateRange[0]} and created_at <= ${createDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';

  var sql = `SELECT count(*) FROM money_stream ${filterString};
            select * FROM money_stream ${filterString} 
            order by created_at desc limit ${size} offset ${offset}`;

  console.info('查询用户流水', sql);;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      const totalCount = vals[0][0]['count(*)'];
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

// 导出用户金额流水
money.exportAll = async function(req, res, next) {
  const { type, userId, createDateRange } = req.body;
  const filters = [];
  type && filters.push(`type=${type}`);
  userId && filters.push(`user_id=${userId}`);
  createDateRange && createDateRange.length === 2 && filters.push(`created_at >= ${createDateRange[0]} and created_at <= ${createDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  const sql = `select * FROM money_stream ${filterString} order by created_at desc`;
  const result = await query(sql);
  if (!result.fail && result instanceof Array) {
    const exportConfig = {};
    exportConfig.cols = [
      {
        caption: 'id',
        type: 'number',
      }, {
        caption: '用户ID',
        type: 'number',
      }, {
        caption: '类型(1.充值;2.提现;3.收入;4.支出;)',
        type: 'number',
      }, {
        caption: '金额',
        type: 'number',
      }, {
        caption: '账户余额',
        type: 'number',
      }, {
        caption: '备注',
        type: 'string',
      }, {
        caption: '创建时间',
        type: 'string',
      },
    ];
    const temp = [];
    result.forEach((item) => {
      temp.push([
        item.id,
        item.user_id,
        item.type,
        item.money,
        item.balance,
        item.remark,
        item.created_at ? moment(+item.created_at).format('YYYY-MM-DD HH:mm:ss') : '',
      ]);
    });
    exportConfig.rows = temp;
    req.body.excelData = { exportConfig, prefix: '金额流水' };
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null });
  }
};