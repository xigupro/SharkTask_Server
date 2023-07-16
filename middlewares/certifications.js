/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const certifications = {};
exports.certifications = certifications;

//获取认证列表
certifications.get = async function(req, res, next) {
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
  const { createdAt, userId, truename, phone, status } = param;
  const filters = [];
  truename && filters.push(`truename like "%${truename}%"`);
  phone && filters.push(`phone like "%${phone}%"`);
  userId && filters.push(`user_id=${userId}`);
  [0,1,2,'0','1','2'].includes(status) && filters.push(`status=${status}`);
  createdAt && filters.push(`TO_DAYS(FROM_UNIXTIME(created_at/1000))=TO_DAYS(FROM_UNIXTIME(${new Date(createdAt).getTime()/1000}))`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  var sql = `SELECT count(*) FROM certifications ${filterString};
             SELECT * FROM certifications ${filterString} 
             order by created_at desc limit ? offset ?`;
  const queryResult = await query(sql, null, [size, offset], '查询认证列表');
  if (!queryResult.fail && queryResult instanceof Array) {
    const totalCount = queryResult[0][0]['count(*)'];
    const totalPage = Math.ceil(parseInt(totalCount) / size);
    req.body.data = {
      list: queryResult[1],
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
    return res.json({ code: '10001', message: queryResult.message, success: false, data: null});
  }
}

// 获取认证详情
certifications.detail = function(req, res, next) {
  const userId = req.body.userId;
  const sql = `SELECT * FROM certifications where user_id=${userId}`;
  console.info("获取认证详情", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals[0];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}

// 用户提交认证资料
certifications.add = async function(req, res, next) {
  const certificate = req.body.certificate;
  const wxpay_code = req.body.wxpay_code;
  const alipay_code = req.body.alipay_code;
  const userId = req.body.userId;
  const truename = req.body.truename;
  const phone = req.body.phone;
  const remark = req.body.remark;
  const idCard = req.body.idCard;
  const createdAt = new Date().getTime();
  const checkResult = await query(`select id from certifications where user_id=?`, null, [userId], '查询认证详情');
  if (!checkResult.fail && checkResult instanceof Array) {
    if (checkResult[0] && checkResult[0].id) {
      return res.json({ code: '10001', message: '请勿重复提交', success: false, data: null }); 
    }
  }
  const sql = `insert into certifications(certificate,wxpay_code,alipay_code,user_id,truename,phone,remark,status,created_at,id_card)
               values("${certificate}","${wxpay_code}","${alipay_code}",${userId},"${truename}","${phone}","${remark}",0,"${createdAt}","${idCard}")`;
  console.info("用户提交认证资料", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 设置消息内容
      req.body.message_add = {
        type: 1,
        user_id: 1,
        business_id: {certification_id: vals.insertId},
        title: '用户申请认证',
        content: `ID为${userId}的用户提交了认证资料给你审核，认证ID为${vals.insertId}`,
      }
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 管理员审核认证资料
certifications.review = function(req, res, next) {
  const certificate = req.body.certificate;
  const wxpay_code = req.body.wxpay_code;
  const alipay_code = req.body.alipay_code;
  const userId = req.body.userId;
  const truename = req.body.truename;
  const phone = req.body.phone;
  const remark = req.body.remark;
  const result = req.body.result;
  const status = req.body.status;
  const idCard = req.body.idCard;
  const updatedAt = new Date().getTime();
  const reviewedAt = req.body.reviewedAt;
  const sql = `update certifications set 
               certificate="${certificate}",
               wxpay_code="${wxpay_code}",
               alipay_code="${alipay_code}",
               truename="${truename}",
               phone="${phone}",
               remark="${remark}",
               status=${status}, 
               updated_at="${updatedAt}", 
               reviewed_at="${reviewedAt}", 
               result="${result || ''}",
               id_card="${idCard}"
               where user_id=${userId};
               update users set is_certified=${status == 1 ? 1 : 0} where id=${userId};`;
  console.info("用户更新认证资料", sql);
  query(sql, (err, vals) => {
    if (!err) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `${status == 1 ? '通过' : '驳回'}了用户ID为${userId}的认证申请`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 用户更新认证资料
certifications.update = function(req, res, next) {
  const certificate = req.body.certificate;
  const wxpay_code = req.body.wxpay_code;
  const alipay_code = req.body.alipay_code;
  const userId = req.body.userId;
  const truename = req.body.truename;
  const phone = req.body.phone;
  const remark = req.body.remark;
  const idCard = req.body.idCard;
  const updatedAt = new Date().getTime();
  const sql = `update certifications set 
               certificate="${certificate}",
               wxpay_code="${wxpay_code}",
               alipay_code="${alipay_code}",
               truename="${truename}",
               phone="${phone}",
               remark="${remark}",
               updated_at="${updatedAt}", 
               reviewed_at="",
               id_card="${idCard}",
               status=0
               where user_id=${userId}`;
  console.info("用户更新认证资料", sql);
  query(sql, (err, vals) => {
    if (!err) {
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

// 删除用户认证资料
certifications.remove = function(req, res, next) {
  const id = req.body.id;
  const userId = req.body.userId;
  const sql = `delete from certifications where id=${id};
               update users set is_certified=0 where id=${userId}`;
  console.info("删除用户认证资料", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了用户ID为${userId}的认证资料`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}