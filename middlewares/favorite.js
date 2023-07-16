/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const query = require('../utils/pool');
const favorite = {};
exports.favorite = favorite;

// 收藏列表
favorite.list = function(req, res, next) {
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
  // 类型
  var type = req.body.type || 1;
  // 类型
  var user_id = req.body.user_id;

  var sql = `SELECT COUNT(*) FROM favorite where type=${type} and user_id=${user_id};
            select tasks.id,tasks.money,tasks.title,tasks.thumbnail,favorite.created_at 
            FROM favorite left join tasks on favorite.task_id=tasks.id 
            where favorite.type=${type} and favorite.user_id=${user_id} 
            order by favorite.created_at desc limit ${size} offset ${offset}`;

  console.info('查询收藏', sql);
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

// 添加收藏
favorite.add = function(req, res, next) {
  const type = req.body.type;
  const user_id = req.body.user_id;
  const task_id = req.body.task_id;
  const created_at = new Date().getTime();
  const sql = `insert into favorite(user_id,task_id,type,created_at) 
               values(${user_id},
               ${task_id},
               ${type},
               '${created_at}')`;
  console.info('添加收藏', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
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


// 添加收藏
favorite.isFavorite = function(req, res, next) {
  const type = req.body.type;
  const user_id = req.body.user_id;
  const task_id = req.body.task_id;
  const sql = `select * from favorite where type=${type} and user_id=${user_id} and task_id=${task_id}`;
  console.info('是否已收藏', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = !!vals.length;
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

// 删除收藏
favorite.remove = function(req, res, next) {
  const type = req.body.type;
  const user_id = req.body.user_id;
  const task_id = req.body.task_id;
  const sql = `delete from favorite where type=${type} and user_id=${user_id} and task_id=${task_id}`;
  console.info('删除收藏', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
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