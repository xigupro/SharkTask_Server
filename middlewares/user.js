/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const moment = require('moment');
const query = require('../utils/pool');
const tools = require('../utils/function');
const { UserService } = require('../service/user');
const user = {};
exports.user = user;

// 查询当前用户信息
user.info = function(req, res, next) {
  const user_id = req.body.userId || req.body.userId;
  let openid = req.body.openid || req.body.openid;
  let unionid = req.body.unionid || req.body.unionid;
  const skey = req.headers.skey;
  if (skey) {
    global.redisClient.get(skey, function(err, reply) {
      if (reply) {
        // 截取openid
        const values = reply.toString().split(':');
        if (values[0] === 'openid') {
          openid = values[1];
        } else if (values[0] === 'unionid') {
          unionid = values[1];
        }
        doQuery();
      } else {
        return res.json({ code: '10005', message: err || '登录已过期，请重新登录', success: false, data: null }); 
      }
    });
  } else {
    if (!user_id && !openid && !unionid) {
      return res.json({ code: '10001', message: '查询标识为空', success: false, data: null }); 
    }
    doQuery();
  }
  function doQuery() {
    let filter = '';
    if (user_id) {
      filter = `id=${user_id}`;
    } else if (unionid) {
      filter = `unionid="${unionid}"`;
    } else if (openid) {
      filter = `openid="${openid}"`;
    }
    const sql = `select account_amount,
                 avatar,
                 city,
                 country,
                 created_at,
                 deleted,
                 finished_amount,
                 gender,
                 id,
                 inviter,
                 is_certified,
                 is_vip,
                 nick_name,
                 openid,
                 openid_type,
                 password,
                 phone,
                 province,
                 refresh_count,
                 role,
                 status,
                 task_limit,
                 unionid,
                 updated_at,
                 username,
                 vip_expire_in,
                 vip_price,
                 sign_count,
                 sign_at,
                 score,
                 level,
                 withdraw_amount from users where 
                 ${filter}`;
    console.info("查询用户信息", sql);
    query(sql, async (err, vals) => {
      if (!err && vals instanceof Array && vals[0]) {
        const userInfo = vals[0];
        console.info('用户信息', userInfo)
        const levelInfo = await UserService.getLevelInfo(userInfo.level)
        console.info('用户等级信息', levelInfo)
        userInfo.level_info = levelInfo
        // 对比vip用户和用户对应等级 所拥有的可领取任务数
        if (userInfo.task_limit >= 0) {
          if (levelInfo.id) {
            // 取大数
            userInfo.task_limit = levelInfo.task_limit > 0 && userInfo.task_limit > levelInfo.task_limit
              ? userInfo.task_limit
              : levelInfo.task_limit
          }
          // 用户今日领取的任务数
          const taskSql = `select count(*) as count from user_tasks where user_id=${userInfo.id} and TO_DAYS(FROM_UNIXTIME(created_at/1000))=TO_DAYS(FROM_UNIXTIME(${new Date().getTime()/1000}))`
          const taskResult = await query(taskSql, null, null, '查询用户今日领取任务数量')
          console.info('今日领取任务数', taskResult)
          if (!taskResult.fail && taskResult instanceof Array) {
            // 小于0则无限制
            const taskReduce = userInfo.task_limit - taskResult[0].count
            userInfo.task_limit = userInfo.task_limit < 0 ? -1 : (taskReduce <= 0 ? 0 : taskReduce)
          }
        }
        // 获取下一等级信息
        const nextLevelInfo = await UserService.getLevelInfo(userInfo.level + 1)
        if (nextLevelInfo.id) {
          userInfo.next_level = nextLevelInfo
        }
        
        req.body.data = userInfo;
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        return next();
      } else if (!vals[0]) {
        return res.json({ code: '10009', message: '用户信息不存在', success: false, data: null }); 
      } else {
        return res.json({ code: '10001', message: err, success: false, data: null }); 
      }
    })
  }
}

// 根据id查询用户信息
user.getInfoByID = function(req, res, next) {
  const user_id = req.body.userId;
  const skey = req.headers.skey;
  if (skey) {
    global.redisClient.get(skey, function(err, reply) {
      if (reply) {
        doQuery();
      } else {
        return res.json({ code: '10005', message: err || '登录已过期，请重新登录', success: false, data: null }); 
      }
    });
  }
  function doQuery() {
    const sql = `select account_amount,
                 avatar,
                 city,
                 country,
                 created_at,
                 deleted,
                 finished_amount,
                 gender,
                 inviter,
                 is_certified,
                 is_vip,
                 nick_name,
                 phone,
                 province,
                 refresh_count,
                 role,
                 status,
                 task_limit,
                 updated_at,
                 username,
                 vip_expire_in,
                 vip_price,
                 withdraw_amount from users where 
                 id=${user_id}`;
    console.info("根据ID查询用户信息", sql);
    query(sql, (err, vals) => {
      if (!err && vals instanceof Array && vals[0]) {
        req.body.data = vals[0];
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        return next();
      } else if (!vals[0]) {
        return res.json({ code: '10009', message: '用户信息不存在', success: false, data: null }); 
      } else {
        return res.json({ code: '10001', message: err, success: false, data: null }); 
      }
    })
  }
}

// 后台管理》分页获取用户列表
user.all = function(req, res, next) {
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

  const { nickname, userId, username, phone, registerDateRange, sort } = param;
  // 筛选
  const filters = ['deleted=0'];
  nickname && filters.push(`nick_name like "%${nickname}%"`);
  username && filters.push(`username like "%${username}%"`);
  phone && filters.push(`phone like "%${phone}%"`);
  userId && filters.push(`id=${userId}`);
  registerDateRange && registerDateRange.length === 2 && filters.push(`created_at >= ${registerDateRange[0]} and created_at <= ${registerDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  // 排序
  const orderString = sort instanceof Array && sort.length ? `order by ${(sort.map(item => `${item.prop} ${item.order === 'descending' ? 'desc' : 'asc'}`)).join(',')}` : '';
  var sql = `SELECT count(*) FROM users ${filterString};
            select * FROM users ${filterString} ${orderString} limit ${size} offset ${offset}`;

  console.info('查询用户', sql);;
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

// 后台管理》导出用户列表
user.exportAll = async function(req, res, next) {
  const { nickname, userId, username, phone, registerDateRange, sort } = req.body;
  const filters = ['deleted=0'];
  nickname && filters.push(`nick_name like "%${nickname}%"`);
  username && filters.push(`username like "%${username}%"`);
  phone && filters.push(`phone like "%${phone}%"`);
  userId && filters.push(`id=${userId}`);
  registerDateRange && registerDateRange.length === 2 && filters.push(`created_at >= ${registerDateRange[0]} and created_at <= ${registerDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  // 排序
  const orderString = sort instanceof Array && sort.length ? `order by ${(sort.map(item => `${item.prop} ${item.order === 'descending' ? 'desc' : 'asc'}`)).join(',')}` : '';
  const sql = `select * FROM users ${filterString} ${orderString}`;
  const result = await query(sql);
  if (!result.fail && result instanceof Array) {
    const exportConfig = {};
    exportConfig.cols = [
      {
        caption: 'id',
        type: 'number',
      },
      {
        caption: 'openid',
        type: 'string',
      }, {
        caption: 'openid_type(1.小程序;2.公众号;3.APP)',
        type: 'number',
      }, {
        caption: 'unionid',
        type: 'string',
      }, {
        caption: '昵称',
        type: 'string',
      }, {
        caption: '性别',
        type: 'number',
      }, {
        caption: '国家',
        type: 'string',
      }, {
        caption: '省份',
        type: 'string',
      }, {
        caption: '城市',
        type: 'string',
      }, {
        caption: '头像',
        type: 'string',
      }, {
        caption: '注册时间',
        type: 'string',
      }, {
        caption: '更新时间',
        type: 'string',
      }, {
        caption: '账户余额',
        type: 'number',
      }, {
        caption: '已提金额',
        type: 'number',
      }, {
        caption: '提现中的金额',
        type: 'number',
      }, {
        caption: '用户状态(1.正常;2.冻结)',
        type: 'number',
      }, {
        caption: '邀请人',
        type: 'number',
      }, {
        caption: '用户名',
        type: 'string',
      }, {
        caption: '密码',
        type: 'string',
      }, {
        caption: '已认证(1.是;0.否)',
        type: 'number',
      }, {
        caption: '剩余可领取的任务数量，设为负数则不限制',
        type: 'number',
      }, {
        caption: '是否会员(1.是;0.否)',
        type: 'number',
      }, {
        caption: '会员到期时间',
        type: 'string',
      }, {
        caption: '剩余任务刷新次数',
        type: 'number',
      }, {
        caption: '手机号',
        type: 'string',
      }, {
        caption: '积分',
        type: 'number',
      }, {
        caption: '最近一次签到时间',
        type: 'string',
      }, {
        caption: '连续签到天数',
        type: 'number',
      },
    ];
    const temp = [];
    result.forEach((item) => {
      temp.push([
        item.id,
        item.openid,
        item.openid_type,
        item.unionid,
        item.nick_name,
        item.gender,
        item.country,
        item.province,
        item.city,
        tools.getQiniuFullUrl(item.avatar),
        item.created_at ? moment(+item.created_at).format('YYYY-MM-DD HH:mm:ss') : '',
        item.updated_at ? moment(+item.updated_at).format('YYYY-MM-DD HH:mm:ss') : '',
        item.account_amount,
        item.finished_amount,
        item.withdraw_amount,
        item.status,
        item.inviter,
        item.username,
        item.password,
        item.is_certified,
        item.task_limit,
        item.is_vip,
        item.vip_expire_in ? moment(+item.vip_expire_in).format('YYYY-MM-DD HH:mm:ss') : '',
        item.refresh_count,
        item.phone,
        item.score,
        item.sign_at ? moment(+item.sign_at).format('YYYY-MM-DD HH:mm:ss') : '',
        item.sign_count,
      ]);
    });
    exportConfig.rows = temp;
    req.body.excelData = { exportConfig, prefix: '用户列表' };
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null });
  }
};

//分页获取用户邀请的用户
user.invitedUsers = function(req, res, next) {
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

  const userId = param.userId;

  var sql = `SELECT count(*) FROM users where deleted=0 and inviter=${userId};
            select id,nick_name,gender,country,province,city,avatar,created_at,
            updated_at,role,deleted,account_amount,finished_amount,withdraw_amount,
            status,inviter,username,is_certified,task_limit,is_vip,vip_price,
            vip_expire_in,refresh_count,phone,score,sign_at,sign_count,apple,email,
            email_active FROM users where deleted=0 and inviter=${userId}
            order by created_at desc limit ${size} offset ${offset}`;

  console.info('查询邀请的用户', sql);;
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

// 更新用户信息
user.update = async function (req, res, next) {
  const status = req.body.status;
  const username = req.body.username;
  const password = req.body.password;
  const userId = req.body.userId;
  const taskLimit = req.body.taskLimit;
  const refresh_count = req.body.refresh_count;
  const isVip = req.body.isVip;
  const vipPrice = req.body.vipPrice;
  const avatar = req.body.avatar;
  const phone = req.body.phone;
  let sets = [];
  if (status) {
    sets.push(`status=${status}`);
  }
  if (username) {
    sets.push(`username="${username}"`);
  }
  if (password) {
    sets.push(`password="${password}"`);
  }
  if (typeof(taskLimit) !== 'undefined') {
    sets.push(`task_limit=${taskLimit}`);
  }
  if (typeof(refresh_count) !== 'undefined') {
    sets.push(`refresh_count=${refresh_count}`);
  }
  if (typeof(isVip) !== 'undefined') {
    sets.push(`is_vip=${isVip}`);
  }
  if (typeof(vipPrice) !== 'undefined') {
    sets.push(`vip_price=${vipPrice}`);
  }
  if (avatar) {
    sets.push(`avatar="${avatar}"`);
  }
  if (phone) {
    const result = await query(`select id from users where phone="${phone}"`);
    if (result instanceof Array && result.length && result[0].id != userId) {
      return res.json({ code: '10007', message: '已存在此手机号，请更换', success: false, data: null }); 
    } else {
      sets.push(`phone="${phone}"`);
    }
  }
  
  sets = sets.join(',');
  const sql = `update users set ${sets} where id=${userId}`;
  console.info("更新用户信息", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      if (err.sqlState === '23000') {
        return res.json({ code: '10007', message: '已存在此用户名，请更换', success: false, data: null }); 
      }
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

user.getLevelList = function(req, res, next) {
  const sql = `SELECT * FROM growth_levels order by id`;
  console.info("查询用户等级列表", sql);
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

user.updateLevel = function(req, res, next) {
  const id = req.body.id;
  const task_count = req.body.task_count;
  const invite_count = req.body.invite_count;
  const award_ratio = req.body.award_ratio;
  const award_ratio_two = req.body.award_ratio_two;
  const task_limit = req.body.task_limit;
  const money_monthly = req.body.money_monthly;
  const name = req.body.name;
  const description = req.body.description;
  const sql = `update growth_levels set
               task_count=${task_count},
               invite_count=${invite_count},
               award_ratio=${award_ratio},
               award_ratio_two=${award_ratio_two},
               task_limit=${task_limit},
               money_monthly=${money_monthly},
               name='${name}',
               description='${description}' 
               where id=${id};`;
  console.info("更新用户等级", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `更新了ID为${id}的${name}用户等级`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}

// h5更新邀请者
user.updateInviter = function(req, res, next) {
  const skey = req.headers.skey;
  const inviter = req.body.inviter;
  let username = '';
  if (skey) {
    global.redisClient.get(skey, function(err, reply) {
      if (reply) {
        username = reply.toString();
        const sql = `select * from users where id=${inviter} and deleted=0 and username != '${username}'`;
        console.info('查询邀请者', sql);
        query(sql, (err, vals) => {
          if (!err && vals && vals instanceof Array) {
            if (vals.length) {
              doQuery(inviter, username);
            } else {
              return res.json({ code: '10009', message: '邀请者不存在', success: false, data: null }); 
            }
          } else {
            return res.json({ code: '10001', message: err, success: false, data: null }); 
          }
        })
      } else {
        return res.json({ code: '10005', message: err || '登录已过期，请重新登录', success: false, data: null }); 
      }
    });
  }

  function doQuery(inviter, username) {
    const sql = `update users set inviter = ${inviter} where username='${username}'`;
    console.info("更新邀请者", sql);
    query(sql, (err, vals) => {
      if (!err && vals.affectedRows) {
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
}

// 通过手机号更新用户密码
user.updateUserPassword = function(req, res, next) {
  const phone = req.body.phone;
  const password = req.body.password;
  const sql = `update users set password='${password}' where phone='${phone}';`;
  console.info("根据手机号重设密码", sql);
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