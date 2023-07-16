/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const moment = require('moment');
const query = require('../utils/pool');
const { MessageService } = require('../service/message');
const goods = {};
exports.goods = goods;

// 获取商品
goods.list = async function(req, res, next) {
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

  const { id, title, status, type, createdDateRange, sort } = param;
  // 筛选
  const filters = ['deleted=0'];
  title && filters.push(`title like "%${title}%"`);
  type && filters.push(`type=${type}`);
  id && filters.push(`id=${id}`);
  status && filters.push(`status=${status}`);
  createdDateRange && createdDateRange.length === 2 && filters.push(`created_at >= ${createdDateRange[0]} and created_at <= ${createdDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  // 排序
  const orderString = sort instanceof Array && sort.length ? `order by ${(sort.map(item => `${item.prop} ${item.order === 'descending' ? 'desc' : 'asc'}`)).join(',')}` : '';
  var sql = `SELECT count(*) FROM goods ${filterString};
            select * FROM goods ${filterString} ${orderString} limit ${size} offset ${offset}`;

  console.info('查询商品', sql);;
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
        message: err,
        success: false,
        data: null,
      });
    }
  });
}

// 获取商城订单
goods.orders = async function(req, res, next) {
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

  const { title, type, status, goods_id, order_no, createdDateRange, userId } = param;
  // 筛选
  const filters = ['deleted=0'];
  title && filters.push(`title like "%${title}%"`);
  type && filters.push(`type=${type}`);
  status && filters.push(`status=${status}`);
  goods_id && filters.push(`goods_id=${goods_id}`);
  order_no && filters.push(`order_no='${order_no}'`);
  userId && filters.push(`user_id='${userId}'`);
  createdDateRange && createdDateRange.length === 2 && filters.push(`created_at >= ${createdDateRange[0]} and created_at <= ${createdDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  // 排序
  const orderString = `order by created_at desc`;
  var sql = `SELECT count(*) FROM my_goods ${filterString};
            select * FROM my_goods ${filterString} ${orderString} limit ${size} offset ${offset}`;

  console.info('查询商城订单', sql);;
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
        message: err,
        success: false,
        data: null,
      });
    }
  });
}

// 商城订单详情
goods.orderDetail = async function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from my_goods where id=${id}`;
  const result = await query(sql, null, null, '获取订单详情');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[0];
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
}

// 商品详情
goods.detail = async function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from goods where id=${id}`;
  const result = await query(sql, null, null, '获取商品详情');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[0];
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
}

// 取消订单
goods.cancelOrder = async function(req, res, next) {
  const id = req.body.id;
  const userId = req.body.userId;
  const order = await query(`select * from my_goods where id=${id}`, null, null, '获取订单详情');
  if (order.fail) {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
  const orderDetail = order[0]
  if (orderDetail.status != 1) {
    return res.json({ code: '10001', message: '当前订单状态不能取消', success: false, data: 'err' }); 
  }
  const now = new Date().getTime();
  const sql = `begin;
               update users set 
               account_amount=account_amount+${orderDetail.price} where id=${userId};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(3,${orderDetail.price},(select account_amount from users where id=${userId}),${userId},1,'${now}','取消商品兑换订单');
               update my_goods set status=3,updated_at='${now}' where id=${id};
               update goods set quantity=quantity+${orderDetail.order_quantity} where id=${orderDetail.goods_id};
               commit`;
    const cancelResult = await query(sql, null, null, '取消订单');
    if (!cancelResult.fail) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: '', success: cancelResult.message, data: 'err' });
    }
}

// 发货
goods.deliver = async function(req, res, next) {
  const id = req.body.id;
  const express_no = req.body.express_no;
  const updated_at = new Date().getTime();
  const sql = `update my_goods set express_no=?,status=?,updated_at=? where id=?;`;
  const result = await query(sql, null, [express_no,2,updated_at,id], '发货');
  if (!result.fail && result.affectedRows) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `发货了ID为${id}的订单`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 兑换商品
goods.exchange = async function(req, res, next) {
  const goodsId = req.body.goodsId;
  const userId = req.body.userId;
  const name = req.body.name;
  const tel = req.body.tel;
  const address = req.body.address;
  const quantity = 1;

  const goods = await query(`select * from goods where id=${goodsId}`, null, null, '获取商品详情');
  if (goods.fail) {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
  const user = await query(`select * from users where id=${userId}`, null, null, '获取用户详情');
  if (user.fail) {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
  const goodsDetail = goods[0];
  const userDetail = user[0];
  if (goodsDetail.quantity < quantity) {
    return res.json({ code: '10001', message: '库存不足', success: false, data: 'err' }); 
  }
  if (goodsDetail.status == 0) {
    return res.json({ code: '10001', message: '商品已下架', success: false, data: 'err' }); 
  }
  if (userDetail.account_amount < goodsDetail.price) {
    return res.json({ code: '10001', message: '余额不足', success: false, data: 'err' }); 
  }
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const number = 100000 + Math.floor(Math.random() * 900000);
  const created_at = new Date().getTime();
  const sql = `begin;
               update users set 
               account_amount=account_amount-${goodsDetail.price} where id=${userId};
               insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
               values(4,${goodsDetail.price},(select account_amount from users where id=${userId}),${userId},0,'${created_at}','兑换商品');
               insert into my_goods (
                order_no,
                goods_id,
                user_id,
                express_no,
                status,
                title,
                sub_title,
                thumbnail,
                price,
                express_fee,
                order_quantity,
                quantity,
                content,
                type,
                name,
                tel,
                address,
                created_at) values('shop${timestamp}${number}', ${goodsId}, ${userId}, null, 1, '${goodsDetail.title}',
                '${goodsDetail.sub_title || ''}', '${goodsDetail.thumbnail}', ${goodsDetail.price}, ${goodsDetail.express_fee},
                ${quantity}, ${goodsDetail.quantity}, '${goodsDetail.content}', ${goodsDetail.type}, '${name}', '${tel}',
                '${address}', '${created_at}');
               update goods set quantity=quantity-${quantity} where id=${goodsId};
               commit`;
    const order = await query(sql, null, null, '兑换商品');
    if (!order.fail) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 添加动态
      const { phone, nick_name, username } = userDetail
      await MessageService.addDynamic(`恭喜${phone || nick_name || username}成功兑换${goodsDetail.sub_title}`)
      return next();
    } else {
      return res.json({ code: '10001', message: '', success: order.message, data: 'err' });
    }
}

// 添加商品
goods.add = async function(req, res, next) {
  const { sort,title,sub_title,thumbnail,price,express_fee,type,quantity,status,content } = req.body;
  const createdAt = new Date().getTime();
  const sql = `insert into goods(sort,title,sub_title,thumbnail,price,express_fee,type,quantity,status,content,created_at)
               values(?,?,?,?,?,?,?,?,?,?,?)`;
  const result = await query(sql, null, [sort,title,sub_title,thumbnail,price,express_fee,type,quantity,status,content.join(','),createdAt], '新增商品');
  if (!result.fail && result instanceof Object) {
    req.body.data = result.insertId;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `添加了ID为${result.insertId}的商品`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 更新商品
goods.update = async function(req, res, next) {
  const id = req.body.id;
  const sort = req.body.sort;
  const title = req.body.title;
  const sub_title = req.body.sub_title;
  const thumbnail = req.body.thumbnail;
  const price = req.body.price;
  const express_fee = req.body.express_fee;
  const type = req.body.type;
  const quantity = req.body.quantity;
  const content = req.body.content.join(',');
  const updated_at = new Date().getTime();
  const sql = `update goods set sort=?,title=?,sub_title=?,thumbnail=?,price=?,express_fee=?,type=?,quantity=?,content=?,updated_at=?
  where id=?;`;
  const result = await query(sql, null, [sort,title,sub_title,thumbnail,price,express_fee,type,quantity,content,updated_at,id], '更新商品');
  if (!result.fail && result.affectedRows) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `更新了ID为${id}的商品`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 删除商品
goods.remove = async function(req, res, next) {
  const id = req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update goods set deleted=1,updated_at=${updatedAt} where id=${id}`;
  console.info("删除商品", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了ID为${id}的商品`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}

// 修改商品状态
goods.updateStatus = function(req, res, next) {
  const id = req.body.id;
  const status = req.body.status;
  const sql = `update goods set status=${status} where id=${id}`
  console.info("修改商品状态", sql);
  query(sql, (err, vals) => {
    if (!err) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}

// 获取商品分类
goods.types = async function(req, res, next) {
  const filters = ['deleted=0'];
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  const sql = `SELECT * FROM goods_type ${filterString}`;
  const result = await query(sql, null, null, '获取商品分类');
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

// 删除分类
goods.removeType = function(req, res, next) {
  const id = req.body.id;
  // 先查找是否有商品在使用此分类
  const taskSql = `select count(*) from goods where type=${id} and deleted=0`;
  const sql = `delete from goods_type where id=${id}`;
  console.info('删除商品分类', sql);
  query(taskSql, (taskErr, taskVals) => {
    console.info('查询分类下的商品数返回', taskVals);
    if (!taskErr && taskVals instanceof Array) {
      if (taskVals[0]['count(*)'] > 0) {
        return res.json({ code: '10001', message: '删除失败，有商品在使用此分类', success: false, data: null });
      } else {
        query(sql, (err, vals) => {
          console.info('删除商品分类返回', vals);
          if (!err && vals instanceof Object) {
            req.body.data = vals;
            req.body.code = '10000';
            req.body.message = '操作成功';
            req.body.success = true;
            // 记录操作日志
            req.body.log = Object.assign(req.body.log || {}, {
              client: 1,
              content: `删除了ID为${id}的商品分类`,
            });
            return next();
          } else {
            return res.json({ code: '10001', message: err.code, success: false, data: null }); 
          }
        });
      }
    }
  });
  
}

// 添加分类
goods.addType = function(req, res, next) {
  const name = req.body.name;
  const created_at = new Date().getTime();
  const sql = `insert into goods_type(name, created_at) values("${name}", "${created_at}")`;
  console.info('添加分类', sql);
  query(sql, (err, vals) => {
    console.info('添加分类返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的商品分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}

// 更新分类
goods.updateType = function(req, res, next) {
  const id = req.body.id;
  const name = req.body.name;
  const updated_at = new Date().getTime();
  const sql = `update goods_type set name="${name}",updated_at="${updated_at}" where id=${id}`;
  console.info('更新商品分类', sql);
  query(sql, (err, vals) => {
    console.info('更新商品分类返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `更新了ID为${id}的商品分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}