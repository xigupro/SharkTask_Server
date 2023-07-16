/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const query = require('../utils/pool');
const { replaceIllegalString } = require('../utils/function');
const { UserService } = require('../service/user');
const tasks = {};
exports.tasks = tasks;

//客户端》分页获取任务列表，下架、删除的任务不返回
tasks.getAll = function(req, res, next) {
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
  // 是否推荐
  const recommend = param.recommend;
  // 是否是小程序审核
  const forReview = param.forReview == 1 ? param.forReview : 0;
  // 分类
  const type = param.type;
  const creator = param.creator;
  const title = param.title;
  const client = param.client || 1;
  var offset = (currentPage - 1) * size;

  // 排序
  let order = '';
  let distanceItem = '';
  switch(param.order) {
    case '2':
      // 高价，按价格从高到底排序
      order = 'order by money desc';
      break;
    case '3':
      // 简单，按价格从底到高排序
      order = 'order by money asc';
      break;
    case '4':
      // 会员，只返回会员任务
      order = 'and need_vip=1 order by sort desc,created_at desc';
      break;
    case '5':
      // 自营，只返回平台发布的任务
      order = 'and created_from=1 order by sort desc,created_at desc';
      break;
    case '6':
      // 如果有传经纬度, 则按距离排序
      if (param.lng && param.lat) {
        distanceItem = `(
          SELECT *,
          ROUND(6378.138*2*ASIN(SQRT(POW(SIN((${param.lat}*PI()/180-latitude*PI()/180)/2),2)+COS(${param.lat}*PI()/180)*COS(latitude*PI()/180)*POW(SIN((${param.lng}*PI()/180-longitude*PI()/180)/2),2)))*1000) AS distance
          FROM tasks) as tmp_tasks`
        order = 'order by distance';
      }
      break;
    default:
      // 默认根据排序值和创建时间倒序排序
      order = 'order by if(unix_timestamp(now())*1000 < top_timeout,0,1),sort desc,created_at desc';
      break;
  }
  const filter = `where deleted=0 and status=1 and quantity>0
                  ${recommend == 1 ? ' and recommend = 1 and unix_timestamp(now())*1000 < recommend_timeout' : ''}
                  ${forReview == 1 ? ' and created_from = 1' : ''}
                  ${title ? ` and title like "%${title}%"` : ''}
                  ${!!type ? ` and type = ${type}` : ''} 
                  ${!!creator ? ` and created_by = ${creator}` : ''} 
                  and for_review = ${forReview} 
                  and client like "%${client}%"`;
  var sql = `SELECT COUNT(*) FROM tasks ${filter};
            select * FROM ${distanceItem || 'tasks'} ${filter}
            ${order} limit ${size} offset ${offset}`;
  console.info('查询任务', sql);
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

//管理端》分页获取任务列表，
tasks.getAllUnlimited = function(req, res, next) {
  console.info('查询任务');
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
  // 状态
  const status = +param.status;
  // 分类
  const type = param.type;
  // 标题
  const title = param.title;
  // 发布时间范围
  const addDateRange = param.addDateRange;
  // id
  const id = param.id;
  const sort = param.sort;
  const filters = ['deleted=0'];
  title && filters.push(`title like "%${title}%"`);
  id && filters.push(`id = ${id}`);
  status && filters.push(`status = ${status}`);
  type && filters.push(`type = ${type}`);
  addDateRange && addDateRange.length === 2 && filters.push(`created_at >= ${addDateRange[0]} and created_at <= ${addDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  // 排序
  const orderString = sort instanceof Array && sort.length ? `order by ${(sort.map(item => `${item.prop} ${item.order === 'descending' ? 'desc' : 'asc'}`)).join(',')}` : '';
  var sql = `SELECT count(*) FROM tasks ${filterString};
            select * FROM tasks ${filterString} ${orderString} limit ${size} offset ${offset}`;
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
};

//客户端》获取单个任务详情
tasks.getDetail = function(req, res, next) {
  
  const id = req.body.id;
  const userId = req.body.userId || 0;  // 默认为0，可兼容不登录看详情的情况
  const sql = `SELECT * FROM tasks where id = ${id};
               SELECT * FROM user_tasks where deleted=0 and user_id = ${userId} and task_id = ${id} order by created_at desc;
               select * from task_text_step where task_id = ${id};
               select * from task_image_step where task_id = ${id}`;
  console.info('查询单个任务', sql);
  query(sql, (err, vals) => {
    console.info('查询单个任务返回', err, vals);
    if (!err && vals instanceof Array) {
      // 任务详情
      req.body.data = vals[0][0];

      // 用作判断用户是否已经抢了这个任务
      req.body.data.userTask = vals[1][0];
      console.info(vals[1][0]);
      if (req.body.data.userTask instanceof Object) {
        //如果已经抢了，则判断状态
        const now = new Date().getTime();
        const limited_time = req.body.data.userTask.limited_time*60*1000;
        const created_at = +req.body.data.userTask.created_at;
        if (req.body.data.userTask.limited_time <= 0) {
          // 不限制时间
          req.body.data.userTask.end_time = 0;
        } else if (now - limited_time >= created_at) {
          // 超时未完成已过期，任务状态：1进行中；2.审核中；3已完成；4已过期；5审核失败
          if (req.body.data.userTask.status == 1) {
            // 如果任务原本状态是进行中，则设为过期
            req.body.data.userTask.status = 4;
          }
          // 结束时间，时间戳
          req.body.data.userTask.end_time = now;
        } else {
          // 结束时间，时间戳
          req.body.data.userTask.end_time = created_at+limited_time;
        }
      }

      // 任务文字步骤
      req.body.data.textStep = vals[2];
      // 任务图片步骤
      req.body.data.imageStep = vals[3];

      // 基本参数
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err.code,
        success: false,
        data: null,
      });
    }
  });
};

//用户领取的任务详情(任务快照)
tasks.userTaskDetail = function(req, res, next) {
  const id = req.body.id;
  const sql = `SELECT * FROM user_tasks where deleted=0 and id = ${id};`;
  console.info('查询单个任务', sql);
  query(sql, (err, vals) => {
    console.info('查询单个任务返回', err, vals);
    if (!err && vals instanceof Object) {
      if (!vals.length) {
        return res.json({
          code: '10001',
          message: '任务已取消',
          success: false,
          data: null,
        });
      }
      // 任务详情
      req.body.data = vals[0];
      // 则判断任务状态
      const now = new Date().getTime();
      const limited_time = req.body.data.limited_time*60*1000;
      const created_at = +req.body.data.created_at;
      if (req.body.data.limited_time <= 0) {
        // 不限制时间
        req.body.data.end_time = 0;
      } else if (now - limited_time >= created_at) {
        // 超时未完成已过期，任务状态：1进行中；2.审核中；3已完成；4已过期；5审核失败
        if (req.body.data.status == 1) {
          // 如果任务原本状态是进行中，则设为过期
          req.body.data.status = 4;
        }
        // 结束时间，时间戳
        req.body.data.end_time = now;
      } else {
        // 结束时间，时间戳
        req.body.data.end_time = created_at+limited_time;
      }

      // 任务文字步骤
      req.body.data.textStep = req.body.data.textStep
        ? JSON.parse(req.body.data.textStep.replace(/\n/g, '').replace(/\r/g, '').replace(/\s/g, '')) : [];
      // 任务审核步骤
      req.body.data.reviewStep = req.body.data.reviewStep
        ? JSON.parse(req.body.data.reviewStep.replace(/\n/g, '').replace(/\r/g, '').replace(/\s/g, '')) : [];
      // 任务审核字段
      req.body.data.reviewField = req.body.data.reviewField
        ? JSON.parse(req.body.data.reviewField) : [];

      // 基本参数
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err.code,
        success: false,
        data: null,
      });
    }
  });
};

//获取任务提交审核的步骤
tasks.getReviewStep = function(req, res, next) {
  console.info('查询任务提交审核的步骤', req.body.id);
  const id = req.body.id;
  const sql = `SELECT * FROM task_review_step where task_id = ${id} order by id+0 asc`;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err.code,
        success: false,
        data: null,
      });
    }
  });
};

//获取任务提交审核的字段
tasks.getReviewField = function(req, res, next) {
  console.info('查询任务提交审核的字段', req.body.id);
  const id = req.body.id;
  const sql = `SELECT * FROM task_review_field where task_id = ${id} order by id+0 asc`;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err.code,
        success: false,
        data: null,
      });
    }
  });
};

// 获取当前任务审核列表
tasks.getTaskGrabList = function(req, res, next) {
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
  const status = param.status;
  const task_id = param.task_id;

  var offset = (currentPage - 1) * size;
  const sql = `select COUNT(*) from user_reviews where deleted=0 and task_id=${task_id}${status ? ` and status = ${status}` : ' and status!=4'};
  select t.id,t.review_id,t.title,t.money,t.created_from,t.thumbnail,t.deleted,
  t.limited_time,r.images,r.fields,r.user_id,r.task_id,r.created_at,r.remark,
  r.task_creator,r.status,t.textStep,t.reviewStep,t.reviewField 
  from user_tasks t inner join user_reviews r on 
  t.review_id=r.id 
  where t.task_id=${task_id} 
  and r.deleted=0 
  ${status ? ` and r.status = ${status}` : ' and r.status!=4'}
  limit ${size} offset ${offset}`;
  console.info('获取当前任务审核列表', sql);
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
};

// 获取当前用户参与的任务
tasks.getUserTasks = function(req, res, next) {
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
  let status = param.status;  // 0则获取已删除的
  status = Number(status);
  var offset = (currentPage - 1) * size;

  const filters = [];
  param.userId && filters.push(`user_id=${param.userId}`);
  status && filters.push(`status=${status}`);
  status && filters.push(`deleted=0`);
  !status && filters.push(`deleted=1`);

  const sql = `SELECT count(*) FROM user_tasks where ${filters.join(' and ')};
  select * from user_tasks where ${filters.join(' and ')} 
  limit ${size} offset ${offset}`;
  console.info('获取当前用户参与的任务', sql);
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
        message: err.code,
        success: false,
        data: null,
      });
    }
  });
};

// 获取当前用户发布的任务
tasks.getUserPublishedTasks = function(req, res, next) {
  console.info('获取当前用户发布的任务');
  var param = req.body;
  const status = param.status;
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
  const sql = `SELECT COUNT(*) FROM tasks where deleted=0 and created_from!=1 and created_by=${param.userId}${status ? ` and status = ${status}` : ''};
               select * from tasks where deleted=0 and created_from!=1 and created_by=${param.userId}${status ? ` and status = ${status}` : ''} 
               limit ${size} offset ${offset}`;
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
        message: err.code,
        success: false,
        data: err,
      });
    }
  });
};

// 根据用户ID判断是否是vip
tasks.isVip = function(req, res, next) {
  const userId = req.body.userId || req.body.userId || req.body.user_id || req.body.user_id;
  const sql = `select * from users where id=${userId}`;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      if (vals[0].is_vip == 1) {
        req.body.is_vip = true;
      } else {
        req.body.is_vip = false;
      }
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

// 抢任务
tasks.grab = function(req, res, next) {
  // 任务ID
  const id = req.body.id;
  // 用户ID
  const userId = req.body.userId;
  const taskOriginDetail = req.body.data;

  if (taskOriginDetail.quantity <= 0) {
    return res.json({ code: '10001', message: '任务已被领完', success: false, data: null });
  }

  if (taskOriginDetail.deleted  == 1) {
    return res.json({ code: '10001', message: '任务已被删除', success: false, data: null });
  }

  // 判断到是会员且会员佣金大于零，就取会员佣金
  const isVip = req.body.is_vip;
  const createdAt = new Date().getTime();
  const updatedAt = createdAt;
  const sql = `insert into user_tasks(
               task_id,user_id,created_at,updated_at,title,thumbnail,money,description,
               labels,recommend,quantity,grab_quantity,limited_time,type,for_review,
               repeatable,need_vip,created_by,created_from,service_price,review_time,
               textStep,reviewStep,reviewField) 
               values(${id},${userId},${createdAt},${updatedAt},"${taskOriginDetail.title}",
               "${taskOriginDetail.thumbnail}",${isVip && taskOriginDetail.vip_money > 0 ? taskOriginDetail.vip_money : taskOriginDetail.money},"${taskOriginDetail.description}",
               "${taskOriginDetail.labels}",${taskOriginDetail.recommend},${taskOriginDetail.quantity},
               ${taskOriginDetail.grab_quantity},${taskOriginDetail.limited_time},${taskOriginDetail.type},
               ${taskOriginDetail.for_review},${taskOriginDetail.repeatable},${taskOriginDetail.need_vip},
               ${taskOriginDetail.created_by},${taskOriginDetail.created_from},${taskOriginDetail.service_price},
               ${taskOriginDetail.review_time},
               '${JSON.stringify(taskOriginDetail.textStep)}',
               '${JSON.stringify(taskOriginDetail.reviewStep)}',
               '${JSON.stringify(taskOriginDetail.reviewField)}')`;
  console.info('抢任务', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      // 任务数量减一，用户可领任务数减一
      const reduceSql = `update tasks set quantity=quantity-1, grab_quantity=ifnull(grab_quantity,0)+1 where id=${id};`;
      console.info('抢任务数量增减', reduceSql);
      query(reduceSql);
      req.body.data = vals.insertId;
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
};

// 获取任务分类
tasks.getTypes = function(req, res, next) {
  console.info("获取任务分类");
  query("SELECT * FROM `task_type`", (err, vals, fields) => {
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
}

// 获取审核列表
tasks.getReviewList = function(req, res, next) {
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

  // 任务标题
  const taskTitle = param.taskTitle;
  // 审核状态
  const status = param.status;
  // 姓名
  const truename = param.truename;
  // 用户ID
  const userId = param.userId;
  // 任务ID
  const taskId = param.taskId;
  // 审核ID
  const id = param.id;
  // 任务创建者
  const taskCreator = param.taskCreator;
  // 创建来源
  const createdFrom = param.createdFrom;
  
  let filters = [];
  taskId && filters.push(`r.task_id=${taskId}`);
  userId && filters.push(`r.user_id=${userId}`);
  id && filters.push(`r.id=${id}`);
  (status && status != 0) && filters.push(`r.status=${status}`);
  taskTitle && filters.push(`t.title like "%${taskTitle}%"`);
  taskCreator && filters.push(`r.task_creator=${taskCreator}`);
  createdFrom && filters.push(`t.created_from=${createdFrom}`);
  filters = filters.length ? 'where ' + filters.join(' and ') : '';

  var offset = (currentPage - 1) * size;
  var sql = `SELECT COUNT(r.id) as totalCount FROM user_reviews r left join user_tasks t on r.id=t.review_id ${filters};
            select r.id,
                   r.images,
                   r.deleted,
                   r.fields,
                   r.task_id,
                   r.user_id,
                   r.status,
                   r.created_at,
                   r.updated_at,
                   r.remark,
                   r.review_by,
                   r.review_role,
                   t.title,
                   t.thumbnail,
                   r.task_creator,
                   t.reviewField,
                   t.textStep,
                   t.reviewStep FROM user_reviews r left join user_tasks t on r.id=t.review_id
                   ${filters}
             order by created_at desc limit ${size} offset ${offset}`;
  console.info('查询任务审核列表', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      const totalCount = vals[0][0]['totalCount'];
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

// 获取申诉列表
tasks.getAppealList = function(req, res, next) {
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
  var sql = `SELECT count(*) FROM appeals where deleted=0;
             select 
             a.id,
             a.task_id,
             a.user_id,
             a.review_id,
             a.status,
             a.result,
             a.content,
             a.images,
             a.created_at,
             a.updated_at,
             r.images as review_images,
             r.fields as review_fields,
             r.status as review_status,
             r.remark as review_remark,
             r.task_creator 
             FROM appeals a left join user_reviews r on a.review_id=r.id 
             where a.deleted=0 order by a.created_at desc limit ${size} offset ${offset}`;
  console.info('查询申诉列表', sql);
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

// 审核驳回
tasks.reviewReject = function(req, res, next) {
  console.info("驳回审核");
  const remark = req.body.remark;
  const reviewId = req.body.id;
  const reviewBy = req.body.reviewBy;
  const reviewRole = req.body.reviewRole;
  const updated_at = new Date().getTime();
  const sql = `begin;
               update user_reviews set status=3,review_by=${reviewBy},review_role=${reviewRole},remark="${remark}",updated_at="${updated_at}" where id=${reviewId} and deleted=0;
               update user_tasks set status=5,remark="${remark}",updated_at="${updated_at}" where review_id=${reviewId} and deleted=0;
               commit;`;
  console.info("驳回审核", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      if (!vals[1].affectedRows || !vals[2].affectedRows) {
        return res.json({ code: '10001', message: '任务已被取消', success: false, data: null });
      }
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      
      // 获取消息内容
      const messageSql = `select * from user_tasks where review_id=${reviewId} and deleted=0`;
      query(messageSql, (messageErr, messageVals) => {
        if (!messageErr && messageVals instanceof Object) {
          // 消息内容
          req.body.message_add = {
            type: 4,
            user_id: messageVals[0].user_id,
            business_id: {task_id: messageVals[0].task_id, user_task: messageVals[0].id, review_id: messageVals[0].review_id},
            title: '任务审核失败',
            content: '你提交的任务审核不符合要求，请重新按要求提交资料审核',
          }
          return next();
        }
        console.info('消息内容获取失败', messageErr);
        return next();
      });
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 用户取消任务、雇主删除用户提交的审核，并回收数量
tasks.reviewRemove = async function(req, res, next) {
  const review_id = req.body.id;
  const user_task_id = req.body.user_task_id;
  const task_id = req.body.task_id;
  const checkResult = await query(`select status from user_reviews where id=?`, null, [review_id], '查询任务审核状态');
  if (!checkResult.fail && checkResult instanceof Object) {
    // status：1.审核中；2审核通过；3审核失败；4保存草稿
    if (checkResult[0] && checkResult[0].status == 2) {
      // 审核通过则不能删除
      return res.json({ code: '10001', message: '此任务已审核通过，不能取消', success: false, data: checkResult.message });
    }
  }
  // 校验是否取消过
  const userTaskCheckResult = await query(`select deleted from user_tasks where id=${user_task_id}`);
  if (!userTaskCheckResult.fail && userTaskCheckResult instanceof Object) {
    if (userTaskCheckResult[0] && userTaskCheckResult[0].deleted == 1) {
      return res.json({ code: '10001', message: '此任务已被删除', success: false, data: userTaskCheckResult.message });
    }
  }
  // 判断已领取数量是否异常
  const taskCheckResult = await query(`select grab_quantity from tasks where id=${task_id}`);
  if (!taskCheckResult.fail && taskCheckResult instanceof Object) {
    if (taskCheckResult[0] && (taskCheckResult[0].grab_quantity <= 0)) {
      return res.json({ code: '10001', message: '任务已取消，请勿重复操作', success: false, data: taskCheckResult.message });
    }
  }
  const filters = [];
  review_id && filters.push(`review_id=${review_id}`);
  user_task_id && filters.push(`id=${user_task_id}`);
  const sql = `begin;
               ${review_id ? `update user_reviews set deleted=1 where id=${review_id};` : ''}
               update user_tasks set deleted=1 where ${filters.join(' and ')};
               update tasks set quantity=quantity+1,grab_quantity=grab_quantity-1 where id=${task_id};
               commit;`;
  console.info("删除用户提交的审核", sql);
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

// 审核通过
tasks.reviewResolve = function(req, res, next) {
  const reviewId = req.body.id;
  const reviewBy = req.body.reviewBy;
  const reviewRole = req.body.reviewRole;
  const updated_at = new Date().getTime();
  const sql = `begin;
               update user_reviews set status=2,review_by=${reviewBy},review_role=${reviewRole},updated_at="${updated_at}" where id=${reviewId} and deleted=0 and status<>2;
               update user_tasks set status=3,updated_at="${updated_at}" where review_id=${reviewId} and deleted=0 and status<>3;
               commit;`;
  console.info("审核通过", sql);
  query(sql, (err, vals) => {
    console.info('审核通过返回', vals);
    if (!err && vals instanceof Array) {
      if (!vals[1].affectedRows || !vals[2].affectedRows) {
        return res.json({ code: '10001', message: '任务已被取消或已被审核', success: false, data: null });
      }
      // 获取消息内容
      const messageSql = `select * from user_tasks where review_id=${reviewId} and deleted=0`;
      query(messageSql, async (messageErr, messageVals) => {
        if (!messageErr && messageVals instanceof Object) {
          await UserService.growthLevel(messageVals[0].user_id)
          // 消息内容
          req.body.message_add = {
            type: 4,
            user_id: messageVals[0].user_id,
            business_id: {task_id: messageVals[0].task_id, user_task: messageVals[0].id, review_id: messageVals[0].review_id},
            title: '任务审核通过',
            content: '你提交的任务审核符合要求，佣金已发放，再接再厉哦',
          }
          // 流水备注
          req.body.remark = `发放任务ID为${messageVals[0].task_id}的佣金`;
          return next();
        }
        // 流水备注
        req.body.remark = `发放审核ID为${reviewId}的任务佣金`;
        console.info('消息内容获取失败', messageErr);
        return next();
      });
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 用户提交任务审核
tasks.submitReview = async function(req, res, next) {

  let images = req.body.images;
      images = images instanceof Object ? JSON.stringify(images) : images;
  let fields = req.body.fields;
      fields = fields instanceof Object ? JSON.stringify(fields) : fields;
  const task_id = req.body.taskId;
  const user_id = req.body.userId;
  const userTask = req.body.userTask;
  const taskCreator = req.body.taskCreator;
  // 接收只能是1(审核中)或4(保存草稿)
  const status = req.body.status == 1 ? 1 : 4;
  const created_at = new Date().getTime();
  const updated_at = created_at;

  // 校验是否重复提交。因为user_tasks和user_reviews是一一对应关系，
  // 如果当前领取的任务在user_tasks表中有数据review_id为空，才可以提交审核，否则当做是重复提交
  const checkSql = `select review_id from user_tasks where id=? and deleted=0`;
  const checkResult = await query(checkSql, null, [userTask], '查询是否已提交审核');
  if (!checkResult.fail && checkResult instanceof Array && checkResult[0].review_id) {
    // 说明已提交过审核
    return res.json({ code: '10018', message: '请勿重复提交', success: false, data: null }); 
  }
  const insertSql = `insert into user_reviews(images,fields,task_id,user_id,status,created_at,updated_at,task_creator)
               values('${images}','${fields}','${task_id}','${user_id}','${status}','${created_at}','${updated_at}', ${taskCreator})`;
  console.info("用户提交任务审核", insertSql);
  query(insertSql, (insertErr, insertVals) => {
    console.info("用户提交任务审核返回", insertVals);
    if (!insertErr && insertVals instanceof Object) {
      // 如果是保存草稿，用户任务状态依然保持为1进行中
      const updateSql = `update user_tasks set status=${status === 1 ? 2 : 1},review_id=${insertVals.insertId} where id=${userTask} and deleted=0`;
      console.info("更新用户任务", updateSql);
      query(updateSql, (updateErr, updateVals) => {
        console.info("更新用户任务返回", updateVals);
        if (!updateErr && updateVals instanceof Object) {
          req.body.data = insertVals.insertId;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;

          if (status !== 4) {
            // 设置消息内容
            req.body.message_add = {
              type: 3,
              user_id: taskCreator,
              business_id: {task_id: task_id, user_id: user_id, review_id: insertVals.insertId},
              title: '用户提交审核',
              content: `ID为${user_id}的用户提交了资料给你审核，审核ID为${insertVals.insertId}`,
            }
          }
          return next();
        } else {
          // 更新失败的话，防止用户重复提交，则将上一步的审核删除
          query(`delete from user_reviews where id = ${insertVals.insertId}`);
          return res.json({ code: '10001', message: updateErr.message, success: false, data: updateErr }); 
        }
      });
    } else {
      return res.json({ code: '10001', message: insertErr.message, success: false, data: insertErr }); 
    }
  })
}

// 用户提交申诉
tasks.addAppeal = function(req, res, next) {
  const images = req.body.images;
  const content = req.body.content;
  const review_id = req.body.review_id;
  const task_id = req.body.task_id;
  const user_id = req.body.user_id;
  const created_at = new Date().getTime();
  const insertSql = `begin;
                     insert into appeals(images,content,task_id,user_id,created_at,review_id)
                      values('${images}','${content}','${task_id}','${user_id}','${created_at}', ${review_id});
                     commit;`;
  console.info("用户提交申诉", insertSql);
  query(insertSql, (insertErr, insertVals) => {
    console.info("用户提交申诉返回", insertVals);
    if (!insertErr && insertVals instanceof Array) {
      query(`insert into messages(type,user_id,title,content,business_id,created_at) 
             values(1,1,'用户发起申诉','用户${user_id}针对任务${task_id}发起了申诉，对应审核ID为${review_id}',${insertVals[1].insertId},'${created_at}');`);
      req.body.data = insertVals[1].insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: insertErr.message, success: false, data: insertErr }); 
    }
  })
}

// 更新申诉
tasks.updateAppeal = function(req, res, next) {
  const status = req.body.status;
  const images = req.body.images;
  const content = req.body.content;
  const result = req.body.result;
  const updated_at = new Date().getTime();

  const review_id = req.body.review_id;
  const task_id = req.body.task_id;
  const user_id = req.body.user_id;

  const fields = [];
  status && fields.push(`status=${status}`);
  images && fields.push(`images='${images}'`);
  content && fields.push(`content='${content}'`);
  result && fields.push(`result='${result}'`);
  updated_at && fields.push(`updated_at='${updated_at}'`);

  const sql = `update appeals set ${fields.join(',')} where task_id=${task_id} and user_id=${user_id} and review_id=${review_id}`;
  console.info("用户更新申诉", sql);
  query(sql, (err, vals) => {
    console.info("用户更新申诉返回", vals);
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 获取申诉详情
tasks.getAppeal = function(req, res, next) {
  const review_id = req.body.review_id;
  const user_id = req.body.user_id;
  const sql = `select * from appeals where review_id=${review_id} and user_id=${user_id}`;
  console.info("申诉详情", sql);
  query(sql, (err, vals) => {
    console.info("申诉详情返回", vals);
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

// 用户修改任务审核
tasks.updateReview = function(req, res, next) {
  let images = req.body.images;
      images = images instanceof Object ? JSON.stringify(images) : images;
  let fields = req.body.fields;
      fields = fields instanceof Object ? JSON.stringify(fields) : fields;
  // 接收只能是1(审核中)或4(保存草稿)
  const status = req.body.status == 1 ? 1 : 4;
  const updated_at = new Date().getTime();
  const user_task = req.body.userTask;
  const review_id = req.body.reviewId;

  const insertSql = `update user_reviews set 
                     images='${images}',
                     fields='${fields}',
                     status='${status}',
                     updated_at='${updated_at}' 
                     where id=${review_id} and deleted=0`;
  console.info("用户修改任务审核", insertSql);
  query(insertSql, (insertErr, insertVals) => {
    console.info("用户修改任务审核返回", insertVals);
    if (!insertErr && insertVals instanceof Object) {
      const updateSql = `update user_tasks set status=${status === 1 ? 2 : 1} where id=${user_task} and deleted=0`;
      console.info("更新用户任务", updateSql);
      query(updateSql, (updateErr, updateVals) => {
        console.info("更新用户任务返回", updateVals);
        if (!updateErr && updateVals instanceof Object) {
          req.body.data = true;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          return next();
        } else {
          return res.json({ code: '10001', message: insertErr, success: false, data: null }); 
        }
      });
    } else {
      return res.json({ code: '10001', message: insertErr, success: false, data: null }); 
    }
  })
}

// 根据ID获取审核详情，用户端审核
tasks.getReviewDetailForUser = function(req, res, next) {
  const task_id = req.body.taskId;
  const review_id = req.body.reviewId;
  const sql = `SELECT * FROM user_reviews where id=${review_id};
               SELECT * FROM user_tasks where task_id=${task_id} and review_id=${review_id};`;
  console.info("获取审核详情", sql);
  query(sql, (err, vals) => {
    console.info('获取审核详情返回', vals);
    if (!err && vals instanceof Array) {
      const steps = vals[1][0].reviewStep
        ? JSON.parse(vals[1][0].reviewStep.replace(/\n/g, '').replace(/\r/g, '').replace(/\s/g, '')) : [];
      const fields = vals[1][0].reviewField
        ? JSON.parse(vals[1][0].reviewField) : [];
      if (req.body.data instanceof Object) {
        req.body.data.reviewDetail = vals[0][0];
        req.body.data.steps = steps;
        req.body.data.fields = fields;
      } else {
        req.body.data = {
          reviewDetail: vals[0][0],
          steps: steps,
          fields: fields
        }
      }
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      console.error('获取审核详情出错', err);
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}

// 根据ID获取审核的任务，管理端审核
tasks.getReviewDetail = function(req, res, next) {
  const review_id = req.body.reviewId;
  const user_task_id = req.body.userTask;
  const sql = `SELECT * FROM user_reviews where id=${review_id};
               SELECT * FROM user_tasks where id=${user_task_id}`;
  console.info("获取审核的任务", sql);
  query(sql, (err, vals) => {
    console.info('获取审核的任务返回', vals);
    if (!err && vals instanceof Array) {
      const steps = vals[1][0].reviewStep
        ? JSON.parse(vals[1][0].reviewStep.replace(/\n/g, '').replace(/\r/g, '').replace(/\s/g, '')) : [];
      const fields = vals[1][0].reviewField
        ? JSON.parse(vals[1][0].reviewField) : [];
      if (req.body.data instanceof Object) {
        req.body.data.reviewDetail = vals[0][0];
        req.body.data.steps = steps;
        req.body.data.fields = fields;
      } else {
        req.body.data = {
          reviewDetail: vals[0][0],
          steps: steps,
          fields: fields
        }
        req.body.data.reviewDetail.task_status = vals[1][0].status;
      }
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      console.error('获取审核的任务出错', err);
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}

// 删除任务
tasks.remove = async function(req, res, next) {
  const taskId = req.body.taskId;
  const created_at = new Date().getTime();
  // TODO校验是否是管理员或者任务发布者，才可以删除任务
  const checkResult = await query(`select * from tasks where id=? and deleted=0`, null, [taskId]);
  if (!checkResult.fail && checkResult instanceof Object) {
    if (!checkResult[0]) {
      return res.json({ code: '10001', message: '任务已被删除', success: false, data: null }); 
    }
    let sql = '';
    if (checkResult[0].created_from == 1) {
      // 自营任务，直接删除即可，无需做退还佣金操作
      sql = `update tasks set deleted=1 where id=${taskId}`;
    } else {
      const returnMoney = checkResult[0].quantity * checkResult[0].money;
      if (returnMoney < 0) {
        return res.json({ code: '10001', message: '金额异常', success: false, data: null });
      }
      // 将任务设为下架并删除，将数量设为0，并退还剩余的佣金到用户余额。因为任务价格和数量不可以改的，所以可以直接剩余数量*单价
      sql = `begin;
             update tasks set deleted=1,status=2,quantity=0 where id=${taskId};
             update users set account_amount=account_amount+${returnMoney} where id=${checkResult[0].created_by};`
      if (returnMoney > 0) {
        // 金额大于零才记录到流水
        sql += `insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                values(
                  3,${returnMoney},
                  (select account_amount from users where id=${checkResult[0].created_by}),
                  ${checkResult[0].created_by},1,"${created_at}","删除任务${taskId}回退佣金");`;
      }
      sql += 'commit;';
    }
    const result = await query(sql, null, null, '删除任务');
    if (!result.fail && result instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: result.message, success: false, data: null }); 
    }
  } else {
    return res.json({ code: '10001', message: checkResult.message, success: false, data: null });
  }
}

// 修改任务状态
tasks.updateStatus = function(req, res, next) {
  const taskId = req.body.taskId;
  const status = req.body.status;
  const creator = req.body.creator;
  const status_text = req.body.status_text || '';
  const sql = `update tasks set status=${status},status_text="${status_text}" where id=${taskId}`
  console.info("修改状态", sql);
  query(sql, (err, vals) => {
    if (!err) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;

      // 设置消息内容
      switch (+status) {
        case 1:
          // 上架
          req.body.message_add = {
            type: 2,
            user_id: creator,
            business_id: {task_id: taskId},
            title: '任务上架',
            content: '你发布的任务已经发布上架，赶紧去推广吧',
          }
          break;
        case 2:
          // 下架
          req.body.message_add = {
            type: 2,
            user_id: creator,
            business_id: {task_id: taskId},
            title: '任务下架',
            content: '你发布的任务已经改为下架',
          }
          break;
        case 3:
          // 审核通过
          req.body.message_add = {
            type: 2,
            user_id: creator,
            business_id: {task_id: taskId},
            title: '任务审核通过',
            content: '你发布的任务已经审核通过，赶紧去推广吧',
          }
          break;
        case 4:
          // 审核不通过
          req.body.message_add = {
            type: 2,
            user_id: creator,
            business_id: {task_id: taskId},
            title: '任务审核失败',
            content: '你发布的任务审核失败，赶紧去看看原因',
          }
          break;
        default:
          break;
      }
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}

// 添加任务
tasks.add = async function(req, res, next) {
  // 主表基本信息
  const title = req.body.title;
  const status = req.body.status;
  const updated_at = new Date().getTime();
  const created_at = updated_at;
  const autoend_at = req.body.autoend_at || '';
  const thumbnail = req.body.thumbnail;
  const money = +req.body.money;
  const vip_money = +req.body.vip_money;
  const description = req.body.description;
  const labels = req.body.labels || '';
  const recommend = req.body.recommend;
  const recommend_timeout = req.body.recommend_timeout;
  const limited_time = req.body.limited_time || 0;
  const for_review = req.body.for_review || 0;
  const repeatable = req.body.repeatable || 0;
  const need_vip = req.body.need_vip || 0;
  const sort = req.body.sort || 0;
  const quantity = +req.body.quantity;
  const grab_quantity = req.body.grab_quantity || 0;
  const reviewField = req.body.reviewField || [];
  const created_by = req.body.created_by;
  const created_from = req.body.created_from;
  const type = req.body.type;
  const scoreMoney = req.body.scoreMoney;
  const score_rate = req.body.score_rate;
  const score = req.body.score || 0;
  const review_time = req.body.review_time;
  const clients = req.body.clients instanceof Array ? req.body.clients.join(',') : 1;
  const longitude = req.body.longitude || null;
  const latitude = req.body.latitude || null;
  const location_name = req.body.location_name || '';
  // 任务服务费
  const service_price = +req.body.service_price || 0;
  // 是否按照百分比来收取任务服务费
  const is_ratio = +req.body.is_ratio || 0;
  // 任务总金额，含服务费
  const total_money = +req.body.total_money || 0;
  if (money <= 0) {
    return res.json({ code: '10001', message: '任务金额必须大于0', success: false, data: false }); 
  }
  // 如果是用户发布的任务，则需要减掉用户金额。
  let reduceAmountSql = '';
  if (created_from != 1) {
    console.info('任务单价', money);
    console.info('任务数量', quantity);
    const userResult = await query(`select account_amount from users where id=${created_by}`);
    if (!userResult.fail && userResult instanceof Array && userResult[0].account_amount < total_money ) {
      // 余额不足
      return res.json({ code: '10001', message: '余额不足', success: false, data: null });
    }
    reduceAmountSql = `update users set account_amount=account_amount-${total_money} where id=${created_by};`
  }
  const sql = `insert into tasks(client,autoend_at,review_time,service_price,created_by,created_from,quantity,grab_quantity,sort,title,status,updated_at,created_at,thumbnail,
               money,vip_money,description,labels,recommend,recommend_timeout,limited_time,type,for_review,repeatable,need_vip,longitude,latitude,location_name)
               values("${clients}","${autoend_at}","${review_time}",${service_price},${created_by},${created_from},${quantity},${grab_quantity},${sort},"${replaceIllegalString(title)}",${status},"${updated_at}","${created_at}",
               "${thumbnail}",${money},${vip_money},"${replaceIllegalString(description)}","${replaceIllegalString(labels)}",
               ${recommend},"${recommend_timeout}","${limited_time}","${type}",${for_review},${repeatable},${need_vip},${longitude},${latitude},'${location_name}');`
  console.info("添加任务", reduceAmountSql, sql);
  query(`begin;${reduceAmountSql}${sql}commit;`, async (err, vals) => {
    if (!err && vals instanceof Array) {
      const insertId = created_from != 1 ? vals[2].insertId : vals[1].insertId;
      req.body.taskId = insertId;
      
      // 生成流水
      if (created_from != 1) {
        const streamSql = `insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                          values(4,${total_money},(select account_amount from users where id=${created_by}),${created_by},0,"${created_at}","发布任务${insertId}, 含服务费${service_price}元");`
        const streamRes = await query(streamSql);
        if (streamRes.fail) {
          console.info('发布任务生成流水失败', streamRes);
        }
      }
      // 文字步骤表
      let textStep = req.body.textStep.map((item)=>{
        return `("${replaceIllegalString(item.value)}","${item.key}","${insertId}","${replaceIllegalString(item.copyText)}","${item.images instanceof Array ? item.images.join(',') : ''}")`
      });
      textStep = textStep.join(',');
      textStepSql = `insert into task_text_step(text,created_at,task_id,copy_text,images) values${textStep};`;
      // 提审步骤表
      let reviewStep = req.body.reviewStep.map((item)=>{
        // 注意这里之所以乘以100，是因为前端传过来就是11位的
        return `("${item.key}","${item.value}","${replaceIllegalString(item.name)}","${replaceIllegalString(item.copyText)}","${item.key*100}",${insertId})`
      });
      reviewStep = reviewStep.join(',');
      reviewStepSql = `insert into task_review_step(id,image,text,copy_text,created_at,task_id) values${reviewStep};`;
      // 提审字段表
      let reviewFieldValues = reviewField.map((item)=>{
        // 注意这里之所以乘以100，是因为前端传过来就是11位的
        return `("${item.key}","${replaceIllegalString(item.placeholder)}","${replaceIllegalString(item.name)}","${item.key*100}",${insertId})`
      });
      reviewFieldString = reviewFieldValues.join(',');
      reviewFieldSql = reviewFieldString ? `insert into task_review_field(id,placeholder,name,created_at,task_id) values${reviewFieldString};` : '';

      // 如果是用户发布的任务，且用户使用了积分抵扣，则需要减掉用户积分。
      let reduceScoreSql = '';
      if (created_from != 1) {
        reduceScoreSql = `update users set score=score-${score} where id=${created_by};
                          insert into score_stream(business_id,type,score,balance,user_id,is_income,created_at,remark) 
                          values(${insertId},2,${score},(select score from users where id=${created_by}),${created_by},0,'${created_at}','发布任务积分抵扣, 汇率${score_rate}, 共抵扣${scoreMoney}元');
                          insert into messages(type,user_id,title,content,business_id,created_at) 
                          values(1,1,'用户发布任务','用户${created_by}发布了任务“${title}”, 总共花费了${total_money}元，抵用了${score}积分',${insertId},'${created_at}');`
      }
      const plusSql = `begin;${textStepSql}${reviewStepSql}${reviewFieldSql}${reduceScoreSql}commit;`;
      console.info('执行附加语句', plusSql);
      query(plusSql, (aerr, avals) => {
        if (!aerr && avals instanceof Object) {
          req.body.userId = created_by;
          req.body.taskType = 4;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          if (created_from == 1) {
            // 暂时只记录后台管理的操作日志
            // 记录操作日志
            req.body.log = Object.assign(req.body.log || {}, {
              client: 1,
              content: `发布了ID为${insertId}的任务`,
            });
          }
          return next();
        } else {
          console.info('执行附加语句失败', aerr);
          return res.json({ code: '10003', message: aerr.code, success: false, data: '任务附表插入失败' }); 
        }
      });
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}
// 更新任务
tasks.update = async function(req, res, next) {
  // 主表基本信息
  const taskId = req.body.id;
  const title = req.body.title;
  const updated_at = new Date().getTime();
  const autoend_at = req.body.autoend_at || '';
  const thumbnail = req.body.thumbnail;
  const money = +req.body.money;  // 任务金额用户端不能修改，只有管理端发布的任务可以改，因为佣金可以退，如果可修改则会造成多退的问题
  const vip_money = +req.body.vip_money;  // 只有后台管理可以设置
  const description = req.body.description;
  const labels = req.body.labels || '';
  const limited_time = req.body.limited_time || 0;
  const for_review = req.body.for_review || 0;
  const repeatable = req.body.repeatable || 0;
  const recommend = req.body.recommend || 0;
  const recommend_timeout = req.body.recommend_timeout;
  const sort = req.body.sort || 0;
  const quantity = +req.body.quantity;
  const grab_quantity = req.body.grab_quantity;
  const removeReviewStepIds = req.body.removeReviewStepIds || [];
  const reviewField = req.body.reviewField || [];
  const removeReviewFieldIds = req.body.removeReviewFieldIds || [];
  const need_vip = req.body.need_vip || 0;
  const created_by = req.body.created_by;
  const created_from = req.body.created_from;
  const money_compare = +req.body.money_compare || 0; // 需多退少补的金额
  const status = +req.body.status || 1;
  const review_time = req.body.review_time;
  const clients = req.body.clients instanceof Array ? req.body.clients.join(',') : 1;
  const longitude = req.body.longitude || null;
  const latitude = req.body.latitude || null;
  const location_name = req.body.location_name || '';
  console.info('多退少补', money_compare);
  console.info('即将删除的审核步骤', removeReviewStepIds);
  console.info('即将删除的审核字段', removeReviewFieldIds);
  const type = req.body.type;

  // 补交时需补交的服务费，只有补交时，才需要补交服务费。减少任务数量，不退还服务费
  const catch_service_price = req.body.catch_service_price && req.body.catch_service_price > 0 ? req.body.catch_service_price : 0;

  // 用户发布的任务，如果修改了任务佣金和数量，需多退少补。
  let reduceAmountSql = '';
  if (created_from != 1) {
    const paid = money * quantity;
    if (money_compare > 0) {
      const userResult = await query(`select account_amount from users where id=${created_by}`);
      if (!userResult.fail && userResult instanceof Array && userResult[0].account_amount < money_compare ) {
        // 余额不足
        return res.json({ code: '10001', message: '余额不足', success: false, data: null });
      }
    }
    reduceAmountSql = `update users set account_amount=account_amount-${money_compare} 
                      where id=${created_by};`;
    if (money_compare != 0) {
      reduceAmountSql += `insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                          values(${money_compare>0?4:3},
                                ${money_compare<0?-money_compare:money_compare},
                                (select account_amount from users where id=${created_by}),
                                ${created_by},
                                ${money_compare>0?0:1},
                                "${updated_at}",
                                "更新任务${taskId}${money_compare>0?`补交，含补交服务费${catch_service_price}元`:'退回'}");`;
    }
  }
  const sql = `update tasks set 
               review_time="${review_time}",
               client="${clients}",
               autoend_at="${autoend_at}",
               status=${status},
               created_by=${created_by},
               created_from=${created_from},
               recommend=${recommend},
               ${!recommend_timeout || recommend_timeout === 'undefined' || typeof recommend_timeout === 'undefined' || Object.prototype.toString.call(recommend_timeout) == '[object Null]' ? '' : `recommend_timeout=${recommend_timeout},`}
               quantity=${quantity},
               ${typeof grab_quantity === 'undefined' || Object.prototype.toString.call(grab_quantity) == '[object Null]' ? '' : `grab_quantity=${grab_quantity},`}
               sort=${sort},
               title="${replaceIllegalString(title)}",
               updated_at="${updated_at}",
               thumbnail="${thumbnail}",
               vip_money=${vip_money},
               ${created_from == 1 ? `money=${money},`:''}
               service_price=service_price+${catch_service_price},
               description="${replaceIllegalString(description)}",
               labels="${replaceIllegalString(labels)}",
               limited_time="${limited_time}",
               type="${type}",
               for_review=${for_review},
               repeatable=${repeatable},
               longitude=${longitude},
               latitude=${latitude},
               location_name='${location_name}',
               need_vip=${need_vip} where id=${taskId};`;
  console.info("更新任务", reduceAmountSql, sql);
  query(`begin;${reduceAmountSql}${sql}commit;`, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = true;
      // 先删掉原来的文字步骤、图片步骤
      // 文字步骤表
      let textStep = req.body.textStep.map((item)=>{
        return `("${replaceIllegalString(item.value)}","${item.key}",${taskId},"${replaceIllegalString(item.copyText)}","${item.images instanceof Array ? item.images.join(',') : ''}")`
      });
      textStep = textStep.join(',');
      textStepSql = `delete from task_text_step where task_id=${taskId};
                     insert into task_text_step(text,created_at,task_id,copy_text,images) values${textStep};`;
      // 如果有要删除的提审步骤，则删除
      let removeReviewStepSql = '';
      if (removeReviewStepIds && removeReviewStepIds.length) {
        removeReviewStepSql = `delete from task_review_step where id in (${removeReviewStepIds.join(',')});`
      }
      // 如果有要删除的提审字段，则删除
      let removeReviewFieldSql = '';
      if (removeReviewFieldIds && removeReviewFieldIds.length) {
        removeReviewFieldSql = `delete from task_review_field where id in (${removeReviewFieldIds.join(',')});`
      }
      // 提审步骤表
      let reviewStep = req.body.reviewStep.map((item)=>{
        return `insert into task_review_step(image,text,copy_text,id,task_id) value("${item.value}","${replaceIllegalString(item.name)}","${replaceIllegalString(item.copyText)}","${item.key}",${taskId}) 
                on duplicate key 
                update image="${item.value}",text="${replaceIllegalString(item.name)}",copy_text="${replaceIllegalString(item.copyText)}",updated_at="${updated_at}"`
      });
      let reviewStepSql = reviewStep.join(';');
      // 提审字段表
      let reviewFieldArray = reviewField.map((item)=>{
        return `insert into task_review_field(placeholder,name,id,task_id) value("${replaceIllegalString(item.placeholder)}","${replaceIllegalString(item.name)}","${item.key}",${taskId}) 
                on duplicate key 
                update placeholder="${replaceIllegalString(item.placeholder)}",name="${replaceIllegalString(item.name)}",updated_at="${updated_at}"`
      });
      let reviewFieldSql = reviewFieldArray.length ? reviewFieldArray.join(';') + ';' : '';

      const plusSql = `begin;${textStepSql}${removeReviewStepSql}${removeReviewFieldSql}${reviewStepSql};${reviewFieldSql}commit;`;

      console.info('替换任务附表数据', plusSql);
      query(plusSql, (aerr, avals) => {
        if (!aerr && avals instanceof Object) {
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          return next();
        } else {
          console.info('任务附表替换失败', aerr);
          return res.json({ code: '10003', message: aerr.code, success: false, data: '任务附表替换失败' }); 
        }
      });
    } else {
      console.info('更新任务失败', err);
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}

// 批量更新指定任务的过期任务的status，并回收任务数量
tasks.updateTimeoutTask = function(req, res, next) {
  const taskId = req.body.taskId || req.body.taskId || req.body.id;
  const filters = `where 
                   user_tasks.task_id=${taskId} 
                   and user_tasks.status=1 
                   and user_tasks.deleted=0 
                   and user_tasks.limited_time > 0 
                   and unix_timestamp(now())*1000 - (user_tasks.limited_time*60*1000) >= user_tasks.created_at`
  const affectedRows = `(select rows from (select count(*) as rows from user_tasks ${filters}) as r)`;
  const sql = `begin;
               update tasks set 
               quantity=quantity+${affectedRows},
               grab_quantity=grab_quantity-${affectedRows} where
               id=${taskId} and grab_quantity>=${affectedRows};
               update user_tasks set 
               status=4 ${filters};
               commit;`;
  console.info("批量更新过期任务的status", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// 批量更新自动下架到期的任务
tasks.updateAutoend = function(req, res, next) {
  const sql = `begin;
               update tasks set status=2 
               where unix_timestamp(now())*1000 > autoend_at 
               and autoend_at > 0 
               and status=1;
               commit;`;
  console.info("批量更新自动下架的任务的status", sql);
  query(sql, (err, vals) => {
    return next();
  });
}

// 根据审核ID更新审核超时的任务的status，并发放奖励
tasks.updateReviewTimeoutTask = function(req, res, next) {
  const reviewId = req.body.id;
  const taskId = req.body.taskId;
  const updated_at = new Date().getTime();
  const sql = `begin;
               update user_tasks,user_reviews set 
               user_tasks.status=3,
               user_tasks.updated_at="${updated_at}",
               user_reviews.updated_at="${updated_at}",
               user_reviews.status=2 
               where user_reviews.id=${reviewId} and 
               user_tasks.status=2 
               and user_reviews.status=1 
               and user_reviews.id=user_tasks.review_id 
               and user_tasks.review_time > 0 
               and unix_timestamp(now())*1000 - (user_tasks.review_time*60*1000) >= user_reviews.updated_at;
               commit;`
  console.info("处理审核超时的任务", sql);
  query(sql, (err, vals) => {
    console.info('处理审核超时的任务返回', vals);
    if (!err) {
      if (vals[1].affectedRows > 0) {
        // 流水备注
        req.body.remark = `发放任务ID为${taskId}的佣金`;
        return next();
      } else {
        return res.json({ code: '10000', message: '该任务尚未审核超时', success: true, data: vals });
      }
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err });
    }
  })
}

// 管理端》根据任务ID获取任务详情，包括文字步骤，图片步骤，审核步骤，审核字段
tasks.detail = function(req, res, next) {
  const taskId = req.body.taskId || req.body.taskId || req.body.id || req.body.id;
  const sql = `select * from tasks where id=${taskId};
               select * from task_text_step where task_id=${taskId};
               select * from task_image_step where task_id=${taskId};
               select * from task_review_step where task_id=${taskId} order by id+0 asc;
               select * from task_review_field where task_id=${taskId} order by id+0 asc;`;
  console.info('根据任务ID获取任务详情', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals[0][0];
      req.body.data.textStep = vals[1];
      req.body.data.imageStep = vals[2];
      req.body.data.reviewStep = vals[3];
      req.body.data.reviewField = vals[4];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  });
}

// 根据任务ID获取任务的赏金额
tasks.money = function(req, res, next) {
  const review_id = req.body.id || req.body.id;
  const sql = `select * from user_tasks where review_id=${review_id}`;
  console.info('根据任务ID获取任务的赏金额', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.money = vals[0].money;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  });
}

// 删除分类
tasks.removeType = function(req, res, next) {
  const id = req.body.id;
  // 先查找是否有任务在使用此分类
  const taskSql = `select count(*) from tasks where type=${id} and deleted=0`;
  const sql = `delete from task_type where id=${id}`;
  console.info('删除任务分类', sql);
  query(taskSql, (taskErr, taskVals) => {
    console.info('查询分类下的任务数返回', taskVals);
    if (!taskErr && taskVals instanceof Array) {
      if (taskVals[0]['count(*)'] > 0) {
        return res.json({ code: '10001', message: '删除失败，有任务在使用此分类', success: false, data: null });
      } else {
        query(sql, (err, vals) => {
          console.info('删除任务分类返回', vals);
          if (!err && vals instanceof Object) {
            req.body.data = vals;
            req.body.code = '10000';
            req.body.message = '操作成功';
            req.body.success = true;
            // 记录操作日志
            req.body.log = Object.assign(req.body.log || {}, {
              client: 1,
              content: `删除了ID为${id}的任务分类`,
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
tasks.addType = function(req, res, next) {
  const name = req.body.name;
  const review_name = req.body.review_name;
  const created_at = new Date().getTime();
  const sql = `insert into task_type(name, review_name, created_at) values("${name}","${review_name}", "${created_at}")`;
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
        content: `添加了ID为${vals.insertId}的任务分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}

// 更新分类
tasks.updateType = function(req, res, next) {
  const id = req.body.id;
  const name = req.body.name;
  const review_name = req.body.review_name;
  const updated_at = new Date().getTime();
  const sql = `update task_type set name="${name}",review_name="${review_name}",updated_at="${updated_at}" where id=${id}`;
  console.info('更新任务分类', sql);
  query(sql, (err, vals) => {
    console.info('更新任务分类返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `更新了ID为${id}的任务分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}