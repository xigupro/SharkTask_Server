/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const request = require('request');
const config = require('../config/index');
const { encryptSha1 } = require('../utils/function');
const query = require('../utils/pool');
const { UserService } = require('../service/user');
const login = {};
exports.login = login;

redisClient.on('error', function(err) {
  console.log('Redis Error ' + err);
});


// 记录登录信息
const saveLoginInfo = function(params, loginType, loginClient, req) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      let getUserIDSql = '';
      if (params instanceof Object) {
        getUserIDSql = `(select id from users where ${params.key}='${params.value}')`;
      } else {
        // 直接传用户ID
        getUserIDSql = params;
      }
      const createdAt = new Date().getTime();
      if (data) {
        try {
          const addressInfo = JSON.parse(data);
          const device = req.headers['user-agent'];
          const sql = `insert into login_ips(
                      user_id,ip,country,region,city,lat,lon,org,login_type,login_client,login_at,device) 
                      values(${getUserIDSql},?,?,?,?,?,?,?,?,?,?,?)`;
          const sqlValue = [
            addressInfo.query, addressInfo.country, addressInfo.regionName, addressInfo.city, addressInfo.lat, 
            addressInfo.lon, addressInfo.org, loginType, loginClient, createdAt, device];
          query(sql, null, sqlValue, '记录用户登录信息');
        } catch(err) {
          console.info(err);
        } finally {}
      }
    }
  }
  if (ip !== '::1') {
    request.get(`http://ip-api.com/json/${ip}?lang=zh-CN`, callback);
  }
}


//后台管理》分页获取指定用户登录信息
login.ips = async function(req, res, next) {
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
  let filters = `user_id=${param.userId}`;

  var sql = `SELECT count(*) FROM login_ips where ${filters};
            select * FROM login_ips where ${filters}
            order by login_at desc limit ${size} offset ${offset}`;

  console.info('查询用户登录日志', sql);;
  query(sql, async (err, vals) => {
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

// 检测是否登录，如果不是后台，还校验是否被冻结
login.check = async function(req, res, next) {
  const skey = req.headers.skey;
  console.info('skey', skey);
  global.redisClient.get(skey, async function(err, reply) {
    console.info('校验登录状态返回', reply);
    if (reply && reply.toString()) {
      const values = reply.split(':');
      let sql = '';
      if (values && values.length > 1) {
        // 微信登录
        if (values[0] === 'admin') {
          // 如果是后台管理员，则不校验是否被冻结
          // 记录后台管理日志
          req.body.log = Object.assign(req.body.log || {}, {
            user: values[1],
          });
          return next();
        } else {
          sql = `SELECT status FROM users where ${values[0]}='${values[1]}' and deleted=0`;
        }
      } else {
        // 账号密码登录
        sql = `SELECT status FROM users where (username='${reply}' or phone='${reply}') and deleted=0`;
      }
      const result = await query(sql, null, null, '查询用户状态');
      if (!result.fail && result instanceof Array && result.length && result[0].status != 2) {
        next();
      } else {
        return res.json({ code: '10005', message: '您已被冻结', success: false, data: false});
      }
    } else {
      return res.json({ code: '10005', message: '请登录后再操作', success: false, data: false});
    }
  });
};

// 小程序微信登录
login.miniProgramLogin = async function(req, res, next) {
  const code = req.body.code;
  const params = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: config.wechat.appId,
      secret: config.wechat.appSecret,
      js_code: code,
    },
  };
  console.info('微信小程序登录请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信小程序登录返回参数：', data);
      //生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis
      data.session = encryptSha1(data.session_key);
      let value = data.unionid ? `unionid:${data.unionid}:${data.session_key}` : `openid:${data.openid}:${data.session_key}`;
      global.redisClient.set(
        data.session,
        value,
        global.redis.print,
      );
      delete data.session_key;
      req.body.data = data;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      req.body.withoutBody = true;
      saveLoginInfo({ key: data.unionid ? 'unionid' : 'openid', value: data.unionid || data.openid }, 1, 2, req);
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// 获取小程序全局唯一后台接口调用凭据
login.getAccessToken = async function(req, res, next) {
  const params = {
    uri: 'https://api.weixin.qq.com/cgi-bin/token',
    json: true,
    qs: {
      grant_type: 'client_credential',
      appid: config.wechat.appId,
      secret: config.wechat.appSecret,
    },
  };
  console.info('微信凭据请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信凭据返回参数：', data);
      req.body.data = data;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// 公众号微信登录
login.officialAccountLogin = async function(req, res, next) {
  const code = req.body.code;
  const params = {
    uri: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    json: true,
    qs: {
      appid: config.wechat.officialAccount.appId,
      secret: config.wechat.officialAccount.appSecret,
      code: code,
      grant_type: 'authorization_code',
    },
  };
  console.info('微信公众号登录请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信公众号登录返回参数：', data);
      //生成一个唯一字符串sessionid作为键，将openid和access_token作为值，存入redis
      const session = encryptSha1(data.access_token);
      let value = data.unionid ? `unionid:${data.unionid}:${data.access_token}` : `openid:${data.openid}:${data.access_token}`;
      global.redisClient.set(
        session,
        value,
        'EX',
        86400
      );
      req.body.data = data;
      req.body.data.session = session;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      saveLoginInfo({ key: data.unionid ? 'unionid' : 'openid', value: data.unionid || data.openid }, 1, 3, req);
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// 公众号页面获取用户信息
login.getWechatUserInfo = async function(req, res, next) {
  const access_token = req.body.data.access_token;
  const openid = req.body.data.openid;
  const session = req.body.data.session;
  const params = {
    uri: 'https://api.weixin.qq.com/sns/userinfo',
    json: true,
    qs: {
      access_token: access_token,
      openid: openid,
      lang: 'zh_CN',
    },
  };
  console.info('微信公众号获取用户信息请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信公众号获取用户信息返回参数：', data);
      delete req.body.data.openid;
      req.body.data = data;
      req.body.data.session = session;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      req.body.withoutBody = true;
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// H5登录，支持手机号或用户名登录
login.web = async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const clientType = req.body.clientType;
  if (!username || !password) {
    return res.json({ code: '10004', message: '账号或密码错误', success: false, data: null });
  }
  const sql = `SELECT id,username,role FROM users where (username=? or phone=?) and password=? and deleted=0`;
  const sqlValue = [username, username, password];
  const result = await query(sql, null, sqlValue, 'H5用户登录');
  if (!result.fail && result instanceof Array && result.length) {
    // 记录登录状态，过期时间为两小时
    const session = encryptSha1(username);
    global.redisClient.set(
      session,
      username,
      'EX',
      86400
    );
    result[0].session = session;
    req.body = {
      data: result[0],
      code: '10000',
      message: '操作成功',
      success: true,
    }
    saveLoginInfo(result[0].id, 2, clientType, req);
    return next();
  } else {
    return res.json({ code: '10004', message: '账号或密码错误', success: false, data: null });
  }
};

// 小程序》如不存在此用户则创建，随机生成账号密码
login.createUserFromMiniProgram = async function(req, res, next) {
  const openid = req.body.data.openid;
  const unionid = req.body.data.unionid;
  let filter = '';
  if (unionid) {
    filter = `unionid="${unionid}"`;
  } else if (openid) {
    filter = `openid="${openid}"`;
  }
  const sql = `SELECT id FROM users where ${filter}`;
  query(sql, async (err, vals) => {
    if (!err && vals && !vals.length) {
      // 新用户，则创建
      let userInfo = req.body.userInfo;
      const inviter = req.body.inviter;
      userInfo = typeof userInfo === 'object' ? userInfo : JSON.parse(userInfo);
      const createdAt = new Date().getTime();
      const updatedAt = createdAt;
      const username = Math.random().toString(36).substr(2);
      const password = Math.random().toString(36).substr(2);
      // 初始用户赠送的账户金额
      const baseAmountSql = 'select base_amount from system';
      const baseAmountResult = await query(baseAmountSql);
      let baseAmount = 0;
      if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
        baseAmount = baseAmountResult[0].base_amount || 0;
      }
      const inserSql = `INSERT INTO users set 
                        openid="${openid}", 
                        openid_type=1,
                        unionid="${unionid || ''}", 
                        account_amount=${baseAmount},
                        nick_name="${userInfo.nickName}", 
                        gender="${userInfo.gender}", 
                        country="${userInfo.country}", 
                        province="${userInfo.province}", 
                        city="${userInfo.city}", 
                        avatar="${userInfo.avatarUrl}", 
                        created_at=${createdAt}, 
                        updated_at=${updatedAt}, 
                        username="${username}",
                        password="${password}",
                        task_limit=(select task_limit from growth_levels where level=1),
                        refresh_count=(select refresh_count from system),
                        role=1${inviter && inviter != 'undefined' ? `, inviter=${inviter}`: ''};`;
      console.info('创建用户', inserSql);
      query(inserSql, async (err, insertVal) => {
        if (err) {
          return res.json({
            code: '10001',
            message: err,
            success: false,
            data: null,
          });
        }
        if (baseAmount) {
          query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                 values(3,${baseAmount},${baseAmount},${insertVal.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
        }
        if (inviter && inviter != 'undefined') {
          await UserService.growthLevel(inviter)
        }
        req.body.userId = inviter;
        req.body.taskType = 5;
        return next();
      });
    } else {
      next();
    }
  });
};

// 公众号》如不存在此用户则创建，随机生成账号密码
login.createUserFromOfficialAccount = async function(req, res, next) {
  const openid = req.body.data.openid;
  const unionid = req.body.data.unionid;
  let filter = '';
  if (unionid) {
    filter = `unionid="${unionid}"`;
  } else if (openid) {
    filter = `openid="${openid}"`;
  }
  const sql = `SELECT id FROM users where ${filter}`;
  console.info('查询是否有已注册过', sql);
  query(sql, async (err, vals) => {
    if (!err && vals && !vals.length) {
      // 新用户，则创建
      const inviter = req.body.inviter || null;
      const createdAt = new Date().getTime();
      const updatedAt = createdAt;
      const username = Math.random().toString(36).substr(2);
      const password = Math.random().toString(36).substr(2);
      // 初始用户赠送的账户金额
      const baseAmountSql = 'select base_amount from system';
      const baseAmountResult = await query(baseAmountSql);
      let baseAmount = 0;
      if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
        baseAmount = baseAmountResult[0].base_amount || 0;
      }
      const inserSql = `INSERT INTO users set 
                        openid="${openid}", 
                        openid_type=2, 
                        unionid="${unionid || ''}", 
                        account_amount=${baseAmount},
                        nick_name="${req.body.data.nickname}", 
                        gender="${req.body.data.sex}", 
                        country="${req.body.data.country}", 
                        province="${req.body.data.province}", 
                        city="${req.body.data.city}", 
                        avatar="${req.body.data.headimgurl}", 
                        created_at=${createdAt}, 
                        updated_at=${updatedAt}, 
                        username="${username}",
                        password="${password}",
                        task_limit=(select task_limit from growth_levels where level=1),
                        refresh_count=(select refresh_count from system),
                        role=1${inviter != 'undefined' ? `, inviter=${inviter}`: ''};`;
      console.info('创建用户', inserSql);
      query(inserSql, async (err, insertVal) => {
        if (err) {
          return res.json({
            code: '10001',
            message: err,
            success: false,
            data: null,
          });
        }
        if (baseAmount) {
          query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                 values(3,${baseAmount},${baseAmount},${insertVal.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
        }
        if (inviter && inviter != 'undefined') {
          await UserService.growthLevel(inviter)
        }
        req.body.userId = inviter;
        req.body.taskType = 5;
        return next();
      });
    } else {
      next();
    }
  });
};

// APP微信登录》如不存在此用户则创建
login.createUserFromAPPWeChatLogin = async function(req, res, next) {
  console.info('用户信息', req.body);
  const openid = req.body.openid;
  const unionid = req.body.unionid;
  const clientType = req.body.clientType;
  const sql = `SELECT id,username FROM users where unionid = "${unionid}"`;
  query(sql, async (err, vals) => {
    if (!err && vals instanceof Object) {
      if (!vals.length) {
        // 新用户，则创建
        const inviter = req.body.inviter || null;
        const createdAt = new Date().getTime();
        const updatedAt = createdAt;
        const username = Math.random().toString(36).substr(2);
        const password = Math.random().toString(36).substr(2);

        // 初始用户赠送的账户金额
        const baseAmountSql = 'select base_amount from system';
        const baseAmountResult = await query(baseAmountSql);
        let baseAmount = 0;
        if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
          baseAmount = baseAmountResult[0].base_amount || 0;
        }
        const inserSql = `INSERT INTO users set 
                          openid="${openid}",
                          openid_type=3,
                          unionid="${unionid}", 
                          account_amount=${baseAmount},
                          nick_name="${req.body.nickname}", 
                          gender="${req.body.sex}", 
                          country="${req.body.country}", 
                          province="${req.body.province}", 
                          city="${req.body.city}", 
                          avatar="${req.body.headimgurl}", 
                          created_at=${createdAt}, 
                          updated_at=${updatedAt}, 
                          username="${username}",
                          password="${password}",
                          refresh_count=(select refresh_count from system),
                          task_limit=(select task_limit from growth_levels where level=1),
                          role=1${inviter && inviter != 'undefined' ? `, inviter=${inviter}`: ''};`;
        console.info('APP微信登录创建用户', inserSql);
        query(inserSql, async (err, insertVal) => {
          if (err) {
            return res.json({
              code: '10001',
              message: err,
              success: false,
              data: null,
            });
          }
          if (baseAmount) {
            query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                   values(3,${baseAmount},${baseAmount},${insertVal.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
          }
          // 登录成功
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            86400
          );
          if (inviter && inviter != 'undefined') {
            await UserService.growthLevel(inviter)
          }
          req.body.data = {};
          req.body.userId = inviter;
          req.body.taskType = 5;
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = insertVal.insertId;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          req.body.withoutBody = true;
          saveLoginInfo(insertVal.insertId, 1, clientType, req);
          return next();
        });
      } else {
        // 登录成功
        const session = encryptSha1(vals[0].username);
        global.redisClient.set(
          session,
          vals[0].username,
          'EX',
          86400
        );
        req.body.data = vals[0];
        req.body.data.session = session;
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        saveLoginInfo(vals[0].insertId, 1, clientType, req);
        return next();
      }
    } else {
      return res.json({
        code: '10001',
        message: '登录失败',
        success: false,
        data: null,
      });
    }
  });
};

// APP苹果登录》如不存在此用户则创建
login.createUserFromAPPAppleLogin = async function(req, res, next) {
  console.info('用户信息', req.body);
  const apple = req.body.apple;
  const nickname = req.body.nickname || '';
  const inviter = req.body.inviter || null;
  const sql = `SELECT id,username FROM users where apple = "${apple}"`;
  query(sql, async (err, vals) => {
    if (!err && vals instanceof Object) {
      if (!vals.length) {
        // 新用户，则创建
        const createdAt = new Date().getTime();
        const username = Math.random().toString(36).substr(2);
        const password = Math.random().toString(36).substr(2);
        // 初始用户赠送的账户金额
        const baseAmountSql = 'select base_amount from system';
        const baseAmountResult = await query(baseAmountSql);
        let baseAmount = 0;
        if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
          baseAmount = baseAmountResult[0].base_amount || 0;
        }
        const inserSql = `INSERT INTO users set 
                          apple="${apple}", 
                          account_amount=${baseAmount},
                          nick_name="${nickname}", 
                          created_at=${createdAt}, 
                          username="${username}",
                          password="${password}",
                          refresh_count=(select refresh_count from system),
                          task_limit=(select task_limit from growth_levels where level=1),
                          role=1${inviter && inviter != 'undefined' ? `, inviter=${inviter}`: ''};`;
        console.info('APP苹果登录创建用户', inserSql);
        query(inserSql, async (err, insertVal) => {
          if (err) {
            return res.json({
              code: '10001',
              message: err,
              success: false,
              data: null,
            });
          }
          if (baseAmount) {
            query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                   values(3,${baseAmount},${baseAmount},${insertVal.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
          }
          // 登录成功
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            86400
          );
          if (inviter && inviter != 'undefined') {
            await UserService.growthLevel(inviter)
          }
          req.body.data = {};
          req.body.userId = inviter;
          req.body.taskType = 5;
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = insertVal.insertId;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          req.body.withoutBody = true;
          saveLoginInfo(insertVal.insertId, 4, 5, req);
          return next();
        });
      } else {
        // 登录成功
        const session = encryptSha1(vals[0].username);
        global.redisClient.set(
          session,
          vals[0].username,
          'EX',
          86400
        );
        req.body.data = vals[0];
        req.body.data.session = session;
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        saveLoginInfo(vals[0].id, 4, 5, req);
        return next();
      }
    } else {
      return res.json({
        code: '10001',
        message: '登录失败',
        success: false,
        data: null,
      });
    }
  });
};

// 根据已有的账号密码绑定微信，并登录。可通过用户id或者账号密码绑定
login.bindWechat = async function(req, res, next) {
  const userId = req.body.userId;
  const username = req.body.username;
  const password = req.body.password;
  const openid = req.body.openid || (req.body.data instanceof Object ? req.body.data.openid : '');
  const unionid = req.body.unionid || (req.body.data instanceof Object ? req.body.data.unionid : '');
  const nickname = req.body.nickname || (req.body.data instanceof Object ? req.body.data.nickname : '');
  const sex = req.body.sex || (req.body.data instanceof Object ? req.body.data.sex : '');
  const country = req.body.country || (req.body.data instanceof Object ? req.body.data.country : '');
  const province = req.body.province || (req.body.data instanceof Object ? req.body.data.province : '');
  const city = req.body.city || (req.body.data instanceof Object ? req.body.data.city : '');
  const headimgurl = req.body.headimgurl || (req.body.data instanceof Object ? req.body.data.headimgurl : '');
  const clientType = req.body.clientType;
  const openid_type = clientType == 3 ? 2 : 3;  // 如果为h5，则是公众号绑定微信，否则是APP绑定微信，因为小程序登录目前只支持微信登录

  // 校验微信号是否已被绑定过
  const wechatFilters = [];
  openid && wechatFilters.push(`openid='${openid}'`);
  unionid && wechatFilters.push(`unionid='${unionid}'`);
  const wechatFilterString = wechatFilters.length ? `where ${wechatFilters.join(' and ')}` : '';
  const checkWechatResult = await query(`select id from users ${wechatFilterString}`, null, null, '校验微信号是否被绑定过');
  if (!checkWechatResult.fail && checkWechatResult instanceof Array) {
    if (checkWechatResult.length) {
      return res.json({ code: '10001', message: '此微信已被其他账号绑定', success: false, data: null });
    }
  } else {
    return res.json({ code: '10001', message: checkWechatResult.message, success: false, data: null });
  }

  let filter = `username="${username}" and password="${password}" and deleted=0`;
  if (userId) {
    filter = `id=${userId}`;
  }

  const checkSql = `select id,username from users where ${filter}`
  console.info('查询用户', checkSql);
  query(checkSql, (err, vals) => {
    if (!err && vals instanceof Array && vals.length) {
      // 账号密码正确，将微信用户信息更新到用户
      const updatedAt = new Date().getTime();
      const bindSql = `update users set openid="${openid}",
                       openid_type=${openid_type},
                       unionid="${unionid || ''}", 
                       nick_name="${nickname}", 
                       gender="${sex}", 
                       country="${country}", 
                       province="${province}", 
                       city="${city}", 
                       avatar="${headimgurl}", 
                       updated_at=${updatedAt} where ${filter}`
      console.info('更新用户', bindSql);
      query(bindSql, (bindErr, bindVals) => {
        if (!bindErr && bindVals instanceof Object) {
          // 绑定成功，同时登录
          const username = vals[0].username;
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            86400
          );
          req.body.data = {};
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = vals[0].id;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          saveLoginInfo(vals[0].id, 1, clientType, req);
          return next();
        } else {
          return res.json({
            code: '10011',
            message: '绑定微信失败',
            success: false,
            data: bindErr,
          });
        }
      });
    } else {
      return res.json({
        code: '10004',
        message: '账号或密码错误',
        success: false,
        data: null,
      });
    }
  });
}

// 根据已有的账号密码绑定苹果账号，并登录。可通过用户id或者账号密码绑定
login.bindApple = async function(req, res, next) {
  const userId = req.body.userId;
  const username = req.body.username;
  const password = req.body.password;
  const apple = req.body.apple;

  let filter = `username="${username}" and password="${password}" and deleted=0`;
  if (userId) {
    filter = `id=${userId}`;
  }

  const checkSql = `select id from users where ${filter}`
  query(checkSql, (err, vals) => {
    if (!err && vals instanceof Array && vals.length) {
      // 账号密码正确，将微信用户信息更新到用户
      const updatedAt = new Date().getTime();
      const bindSql = `update users set apple="${apple}",
                       updated_at=${updatedAt} where ${filter}`
      query(bindSql, (bindErr, bindVals) => {
        if (!bindErr && bindVals instanceof Object) {
          // 绑定成功，同时登录
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            86400
          );
          req.body.data = {};
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = vals[0].id;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          saveLoginInfo(vals[0].id, 4, 5, req);
          return next();
        } else {
          return res.json({
            code: '10011',
            message: '绑定Apple ID失败',
            success: false,
            data: bindErr,
          });
        }
      });
    } else {
      return res.json({
        code: '10004',
        message: '账号或密码错误',
        success: false,
        data: null,
      });
    }
  });
}

// 判断微信是否为新用户
login.checkWechatIsNew = async function(req, res, next) {
  const openid = req.body.openid;
  const unionid = req.body.unionid;
  const sql = `select id,username from users where unionid="${unionid}"`;
  query(sql, async (err, vals) => {
    console.info('判断微信是否为新用户', sql, vals);
    if (!err && vals instanceof Object) {
      req.body.data = !!vals.length;  // true为老用户，false为新用户
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

// 判断苹果是否为新用户
login.checkAppleIsNew = async function(req, res, next) {
  const apple = req.body.apple;
  const sql = `select id,username from users where apple="${apple}"`;
  query(sql, async (err, vals) => {
    console.info('判断苹果是否为新用户', sql, vals);
    if (!err && vals instanceof Object) {
      req.body.data = !!vals.length;  // true为老用户，false为新用户
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

// 手机号+短信验证码登录》如不存在此用户则创建
login.createUserFromPhoneLogin = async function(req, res, next) {
  const phone = req.body.phone;
  const clientType = req.body.clientType;
  const sql = `SELECT id,username,phone FROM users where phone = "${phone}"`;
  query(sql, async (err, vals) => {
    if (!err && vals instanceof Object) {
      if (!vals.length) {
        // 新用户，则创建
        const inviter = req.body.inviter || null;
        const createdAt = new Date().getTime();
        const updatedAt = createdAt;
        const username = Math.random().toString(36).substr(2);
        const password = Math.random().toString(36).substr(2);
        // 初始用户赠送的账户金额
        const baseAmountSql = 'select base_amount from system';
        const baseAmountResult = await query(baseAmountSql);
        let baseAmount = 0;
        if (!baseAmountResult.fail && baseAmountResult instanceof Array) {
          baseAmount = baseAmountResult[0].base_amount || 0;
        }
        const inserSql = `INSERT INTO users set 
                          account_amount=${baseAmount},
                          created_at=${createdAt}, 
                          updated_at=${updatedAt}, 
                          username="${username}",
                          password="${password}",
                          phone="${phone}",
                          refresh_count=(select refresh_count from system),
                          task_limit=(select task_limit from growth_levels where level=1),
                          role=1${inviter && inviter != 'undefined' ? `, inviter=${inviter}`: ''};`;
        console.info('手机号登录创建用户', inserSql);
        query(inserSql, async (err, insertVal) => {
          if (err) {
            return res.json({
              code: '10001',
              message: err,
              success: false,
              data: null,
            });
          }
          if (baseAmount) {
            query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                   values(3,${baseAmount},${baseAmount},${insertVal.insertId},1,"${createdAt}","新用户红包");`, null, null, '发放新用户红包');
          }
          // 登录成功
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            864000
          );
          if (inviter && inviter != 'undefined') {
            await UserService.growthLevel(inviter)
          }
          req.body.data = {};
          req.body.userId = inviter;
          req.body.taskType = 5;
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = insertVal.insertId;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          req.body.withoutBody = true;
          saveLoginInfo(insertVal.insertId, 3, clientType, req);
          return next();
        });
      } else {
        // 登录成功
        const session = encryptSha1(vals[0].username);
        global.redisClient.set(
          session,
          vals[0].username,
          'EX',
          86400
        );
        req.body.data = vals[0];
        req.body.data.session = session;
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        saveLoginInfo(vals[0].id, 3, clientType, req);
        return next();
      }
    } else {
      return res.json({
        code: '10001',
        message: '登录失败',
        success: false,
        data: null,
      });
    }
  });
}

// 根据已有账号密码绑定手机号，并登录
login.bindPhoneAndLogin = async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const phone = req.body.phone;
  const clientType = req.body.clientType;

  const checkSql = `select id from users where username="${username}" and password="${password}" and deleted=0`
  query(checkSql, (err, vals) => {
    if (!err && vals instanceof Array && vals.length) {
      // 账号密码正确，将手机号更新到用户
      const updatedAt = new Date().getTime();
      const bindSql = `update users set phone="${phone}",
                       updated_at=${updatedAt} where username="${username}" and password="${password}" and deleted=0`
      query(bindSql, (bindErr, bindVals) => {
        if (!bindErr && bindVals instanceof Object) {
          // 绑定成功，同时登录
          const session = encryptSha1(username);
          global.redisClient.set(
            session,
            username,
            'EX',
            86400
          );
          req.body.data = {};
          req.body.data.username = username;
          req.body.data.session = session;
          req.body.data.id = vals[0].id;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          saveLoginInfo(vals[0].id, 3, clientType, req);
          return next();
        } else {
          return res.json({
            code: '10014',
            message: '绑定手机号失败',
            success: false,
            data: bindErr,
          });
        }
      });
    } else {
      return res.json({
        code: '10004',
        message: '账号或密码错误',
        success: false,
        data: null,
      });
    }
  });
}

// 根据当前登录的用户token绑定手机号
login.bindPhoneByToken = async function(req, res, next) {
  const skey = req.headers.skey;
  const phone = req.body.phone;
  let openid = '';
  let unionid = '';
  let username = '';
  global.redisClient.get(skey, function(err, reply) {
    console.info('解析token', reply);
    if (reply && reply.toString()) {
      const values = reply.toString().split(':');
      if (values[0] === 'openid') {
        openid = values[1];
      } else if (values[0] === 'unionid') {
        unionid = values[1];
      } else {
        // 用户名
        username = reply.toString();
      }
      doBind();
    } else {
      return res.json({
        code: '10005',
        message: '请登录后再操作',
        success: false,
        data: false,
      });
    }
    function doBind() {
      let filter = '';
      if (username) {
        filter = `username='${username}'`;
      } else if (unionid) {
        filter = `unionid="${unionid}"`;
      } else if (openid) {
        filter = `openid="${openid}"`;
      }
      const sql = `update users set phone='${phone}' where 
                   ${filter}`;
      console.info("查询用户信息", sql);
      query(sql, async (err, vals) => {
        if (!err && vals instanceof Object) {
          if (vals.affectedRows) {
            req.body.data = true;
            req.body.code = '10000';
            req.body.message = '操作成功';
            req.body.success = true;
          } else {
            return res.json({ code: '10009', message: '用户信息不存在', success: false, data: null }); 
          }
          return next();
        } else {
          return res.json({ code: '10001', message: err, success: false, data: null }); 
        }
      })
    }
  });
}

// 判断手机号是否为新用户
login.checkPhoneIsNew = async function(req, res, next) {
  const phone = req.body.phone;
  const sql = `select id,username,phone from users where phone="${phone}"`;
  query(sql, async (err, vals) => {
    console.info('判断手机号是否为新用户', sql, vals);
    if (!err && vals instanceof Object) {
      req.body.data = !!vals.length;  // true为老用户，false为新用户
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

// 解绑手机号
login.unbindPhone = async function(req, res, next) {
  const phone = req.body.phone;
  const userId = req.body.userId;
  const sql = `update users set 
               phone=''
               where id=${userId} and phone='${phone}';`;
  console.info("解绑手机号", sql);
  query(sql, async (err, vals) => {
    if (!err && vals instanceof Object && vals.affectedRows) {
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

// 管理员登录
login.admin = async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `SELECT id,username,role,powers FROM administrators where username=? and password=? and deleted=0`;
  const sqlValue = [username, password];
  const result = await query(sql, null, sqlValue, '管理员登陆');
  if (!result.fail && result instanceof Array && result.length) {
    // 记录登录状态，过期时间为两小时
    const session = encryptSha1(username);
    global.redisClient.set(session, `admin:${username}`, 'EX', 86400);
    req.body.data = result[0];
    req.body.data.session = session;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      user: username,
      client: 1,
      content: `管理员${username}登录了后台管理`,
    });
    return next();
  } else {
    return res.json({ code: '10004', message: '账号或密码错误', success: false, data: null });
  }
};
