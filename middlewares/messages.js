/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const messages = {};
exports.messages = messages;

// 获取公告
messages.getNoticeList = function(req, res, next) {
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
  // 分类
  var offset = (currentPage - 1) * size;
  var sql = `SELECT count(*) FROM messages where deleted=0 and type=7;
             select * FROM messages where deleted=0 and type=7 order by created_at desc limit ${size} offset ${offset}`;
  console.info('获取公告列表', sql);
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

// 获取动态
messages.getDynamicList = function(req, res, next) {
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
  // 分类
  var offset = (currentPage - 1) * size;
  var sql = `SELECT count(*) FROM messages where deleted=0 and type=8;
             select * FROM messages where deleted=0 and type=8 order by created_at desc limit ${size} offset ${offset}`;
  console.info('获取动态列表', sql);
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

// 获取消息
messages.list = function(req, res, next) {
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
  // 分类
  const userId = param.userId;
  var offset = (currentPage - 1) * size;
  var sql = `SELECT COUNT(*) FROM messages where deleted=0 and user_id in (0, ${userId}) and type!=8;
             select m.id,m.type,m.business_id,m.title,m.content,m.created_at,s.is_read FROM messages as m 
             left join (select message_id,is_read from messages_state group by message_id,is_read) as s 
             on m.id=s.message_id 
             where m.deleted=0 and m.user_id in (0, ${userId}) and type!=8 
             order by m.created_at desc 
             limit ${size} offset ${offset}`;
  console.info('获取消息列表', sql);
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
// 获取未读消息数
messages.unreadCount = async function(req, res, next) {
  const user_id = req.body.userId;
  const sql = `SELECT COUNT(*) as message_count FROM messages where deleted=0 and user_id in (0, ?) and type!=8;
               SELECT COUNT(*) as read_count FROM messages_state where user_id in (0, ?);`;
  const result = await query(sql, null, [+user_id, +user_id], '获取未读消息数');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[0][0]['message_count']-result[1][0]['read_count'];
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
}
// 添加公告
messages.addNotice = async function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  const created_at = new Date().getTime();
  const sql = `insert into messages(type,title,content,created_at)
               values(?,?,?,?)`;
  const result = await query(sql, null, [7, title, content, created_at], '添加公告');
  if (!result.fail && result instanceof Object) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `添加了ID为${result.insertId}的公告`,
    });
    return next();
  } else {
    return res.json({
      code: '10001',
      message: '添加公告失败',
      success: false,
      data: result.message,
    });
  }
}
// 添加消息
messages.add = function(req, res, next) {
  if (!(req.body.message_add instanceof Object)) {
    return next();
  }
  const type = req.body.message_add.type;
  const user_id = req.body.message_add.user_id;
  // 业务id，是个json，主要用于页面跳转，如:
  // {
  //   task_id: '',
  //   user_id: '',
  //   review_id: '',
  //   user_task: '',
  //   withdraw_id: '',
  // }
  const business_id = req.body.message_add.business_id instanceof Object ? JSON.stringify(req.body.message_add.business_id) : req.body.message_add.business_id;
  const title = req.body.message_add.title;
  const content = req.body.message_add.content;
  const created_at = new Date().getTime();
  const sql = `insert into messages(type,user_id,title,content,business_id,created_at)
               values(${type},${user_id},'${title}','${content}','${business_id}','${created_at}')`;
  console.info("新增消息", sql);
  query(sql, () => {
    delete req.body.message_add;
    return next();
  })
}
// 修改公告
messages.updateNotice = async function(req, res, next) {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const updated_at = new Date().getTime();
  const sql = `update messages set title=?,content=?,updated_at=? where id=?`;
  const result = await query(sql, null, [title, content, updated_at, id], '修改公告');
  if (!result.fail && result instanceof Object) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `修改了ID为${id}的公告`,
    });
    return next();
  } else {
    return res.json({
      code: '10001',
      message: '修改公告失败',
      success: false,
      data: result.message,
    });
  }
}
// 公告详情
messages.getNoticeDetail = async function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from messages where id=${id} and deleted=0`;
  console.info("获取公告详情", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals[0];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}
// 获取消息详情
messages.detail = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const sql = `select * from messages where id=${id} and deleted=0 and user_id in (0, ${user_id});`;
  console.info("获取消息详情", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals[0];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}
// 设为已读
messages.read = function(req, res, next) {
  const id = req.body.id;
  const user_id = req.body.user_id;
  const created_at = new Date().getTime();
  const sql = `insert into messages_state(message_id,is_read,user_id,created_at) values(${id},1,${user_id},${created_at})`;
  console.info("设为已读", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}
// 删除消息
messages.remove = function(req, res, next) {
  const id = req.body.id;
  const updated_at = new Date().getTime();
  const sql = `update messages set deleted=1,updated_at='${updated_at}' where id=${id};`;
  console.info("删除消息", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}