/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const query = require('../utils/pool');
const refresh = {};
exports.refresh = refresh;

// 获取价格表
refresh.list = function(req, res, next) {
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
  var sql = `SELECT COUNT(*) FROM refresh_price where deleted=0;
            select * FROM refresh_price where deleted=0
            order by count desc limit ${size} offset ${offset}`;

  console.info('查询管理员', sql);;
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
        message: err,
        success: false,
        data: null,
      });
    }
  });
};

// 添加刷新价格
refresh.add = function(req, res, next) {
  const original_price = req.body.original_price;
  const price = req.body.price;
  const count = req.body.count;
  const is_show = req.body.is_show;
  const created_at = new Date().getTime();
  const sql = `insert into refresh_price(original_price,price,count,is_show,created_at) values(${original_price},${price},${count},${is_show},"${created_at}")`;
  console.info("添加刷新价格", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的刷新套餐`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 修改刷新价格
refresh.update = function(req, res, next) {
  const id = req.body.id;
  const original_price = req.body.original_price;
  const price = req.body.price;
  const count = req.body.count;
  const is_show = req.body.is_show;
  const updated_at = new Date().getTime();
  const sql = `update refresh_price set original_price=${original_price},price=${price},count=${count},is_show=${is_show},updated_at="${updated_at}" where id=${id}`;
  console.info("修改刷新价格", sql);
  query(sql, (err, vals) => {
    if (!err && vals.affectedRows) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `修改了ID为${id}的刷新套餐`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 删除刷新价格
refresh.remove = function(req, res, next) {
  const id = req.body.id;
  const updated_at = new Date().getTime();
  const sql = `update refresh_price set deleted=1,updated_at="${updated_at}" where id=${id}`;
  console.info("删除刷新价格", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了ID为${id}的刷新套餐`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 用户付费购买刷新次数
refresh.buy = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const created_at = new Date().getTime();
  const sql = `begin;
               update users set refresh_count=refresh_count+(select count from refresh_price where id=${id}),
               account_amount=account_amount-(select price from refresh_price where id=${id}) where id=${user_id};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(4,(select price from refresh_price where id=${id}),(select account_amount from users where id=${user_id}),${user_id},0,"${created_at}","购买任务刷新次数");
               commit`;
  console.info("用户付费购买刷新次数", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 付费刷新
refresh.do = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const sql = `begin;
               update tasks set sort=(
                 select ub.newsort from (
                   select (MAX(ua.sort)+1) newsort from tasks ua where ua.id=${id} and ua.created_by=${user_id}
                   ) ub
                ) where id=${id} and created_by=${user_id} and (select refresh_count from users where id=${user_id}) > 0;
               update users set refresh_count=refresh_count-1 where id=${user_id} and refresh_count>0;
               commit`;
  console.info('付费刷新', sql);
  query(sql, (err, vals) => {
    console.info('付费刷新返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}

// 推荐上首页
refresh.recommend = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const time = req.body.time;
  const money = req.body.money;
  if (money <= 0) {
    return res.json({ code: '10010', message: '金额不合法', success: false, data: money }); 
  }
  const now = new Date().getTime();
  const sql = `begin;
               update tasks set recommend=1,recommend_timeout="${time}" 
               where id=${id} 
               and (select account_amount from users where id=${user_id}) >= ${money};
               update users set account_amount=account_amount-${money} where id=${user_id} and account_amount>=${money};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(4,${money},(select account_amount from users where id=${user_id}),${user_id},0,"${now}","推荐任务上首页");
               commit`;
  console.info('推荐上首页', sql);
  query(sql, (err, vals) => {
    console.info('推荐上首页返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}

// 任务置顶
refresh.top = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const time = req.body.time;
  const money = req.body.money;
  if (money <= 0) {
    return res.json({ code: '10010', message: '金额不合法', success: false, data: money }); 
  }
  const now = new Date().getTime();
  const sql = `begin;
               update tasks set top_timeout="${time}" 
               where id=${id} 
               and (select account_amount from users where id=${user_id}) >= ${money};
               update users set account_amount=account_amount-${money} where id=${user_id} and account_amount>=${money};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(4,${money},(select account_amount from users where id=${user_id}),${user_id},0,"${now}","任务置顶");
               commit`;
  console.info('任务置顶', sql);
  query(sql, (err, vals) => {
    console.info('任务置顶返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}