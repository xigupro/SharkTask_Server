/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const moment = require('moment');
const query = require('../utils/pool');
const tools = require('../utils/function');
const { MessageService } = require('../service/message');
const { UserService } = require('../service/user');
const withdraw = {};
exports.withdraw = withdraw;

// 用户提现
withdraw.submit = async function(req, res, next) {
  const truename = req.body.truename;
  const user_id = req.body.userId;
  const money = req.body.money;
  const withdraw_account = req.body.withdrawAccount;
  const withdraw_type = req.body.withdrawType;
  const withdraw_remark = req.body.withdrawRemark;
  const withdraw_image = req.body.withdrawImage;
  const commission_ratio = req.body.commissionRatio;
  const created_at = new Date().getTime();
  const systemResult = await query('select show_alipay_withdraw,show_wechat_withdraw,show_bank_withdraw from system');
  if (!systemResult.fail && systemResult instanceof Array) {
    if (!systemResult[0].show_alipay_withdraw && withdraw_type === '支付宝') {
      return res.json({ code: '10017', message: '支付宝提现已关闭', success: false, data: null }); 
    }
    if (!systemResult[0].show_wechat_withdraw && withdraw_type === '微信') {
      return res.json({ code: '10017', message: '微信提现已关闭', success: false, data: null }); 
    }
    if (!systemResult[0].show_bank_withdraw && withdraw_type === '银行卡') {
      return res.json({ code: '10017', message: '银行卡提现已关闭', success: false, data: null }); 
    }
  }
  console.info('余额', req.body.data.account_amount);
  if (req.body.data.account_amount < money) {
    // 提现余额大于用户余额
    return res.json({ code: '10001', message: '余额不足', success: false, data: null }); 
  }
  const querySql = `select account_amount from users where id=${user_id}`;
  query(querySql, (queryErr, queryVals) => {
    if (!queryErr && queryVals instanceof Object) {
      console.info('余额', queryVals[0].account_amount, '提现金额', money);
      if (queryVals[0].account_amount < money) {
        return res.json({ code: '10001', message: '余额不足', success: false, data: queryVals[0].account_amount - money }); 
      } else {
        const sql = `begin;
              update users set withdraw_amount=withdraw_amount+${money},account_amount=account_amount-${money} where id=${user_id};
              insert into withdraw_money(money,commission_ratio,user_id,truename,withdraw_type,withdraw_account,withdraw_remark,withdraw_image,created_at,status)
               values(${money},${commission_ratio},'${user_id}','${truename}','${withdraw_type}','${withdraw_account}','${withdraw_remark}','${withdraw_image}','${created_at}',1);
              commit;`;
        console.info("用户提现", sql);
        query(sql, (err, vals) => {
          if (!err && vals instanceof Object) {
            query(`insert into messages(type,user_id,title,content,business_id,created_at) values(1,1,'用户提现','用户${user_id}申请提现${money}元',${vals[2].insertId},'${created_at}')`);
            req.body.data = vals[2].insertId;
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
  });
}


// 提现详情
withdraw.detail = function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from withdraw_money where id=${id}`;
  console.info("提现详情", sql);
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

// 用户提现列表
withdraw.list = function(req, res, next) {
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

  const { user_id, truename, withdrawAccount, withdrawDateRange, status } = req.body;
  const filters = [];
  user_id && filters.push(`w.user_id=${user_id}`);
  status && filters.push(`w.status=${status}`);
  truename && filters.push(`w.truename like "%${truename}%"`);
  withdrawAccount && filters.push(`w.withdraw_account='${withdrawAccount}'`);
  withdrawDateRange && withdrawDateRange.length === 2 && filters.push(`w.created_at >= ${withdrawDateRange[0]} and w.created_at <= ${withdrawDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  var sql = `SELECT count(*) FROM withdraw_money w ${filterString};
             select w.id,w.money,w.commission_ratio,w.user_id,w.truename,
             c.truename as certificate_truename,w.withdraw_type,w.withdraw_account,
             w.withdraw_remark,w.withdraw_image,w.created_at,w.status,w.handle_at,
             w.handle_by,u.openid,u.openid_type 
             FROM withdraw_money w 
             left join users u on w.user_id=u.id
             left join certifications c on u.id=c.user_id ${filterString} 
             order by w.created_at desc limit ${size} offset ${offset}`;

  console.info('查询提现列表', sql);;
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

withdraw.exportAll = async function(req, res, next) {
  const { user_id, truename, withdrawAccount, withdrawDateRange, status } = req.body;
  const filters = [];
  user_id && filters.push(`w.user_id=${user_id}`);
  status && filters.push(`w.status=${status}`);
  truename && filters.push(`w.truename like "%${truename}%"`);
  withdrawAccount && filters.push(`w.withdraw_account='${withdrawAccount}'`);
  withdrawDateRange && withdrawDateRange.length === 2 && filters.push(`w.created_at >= ${withdrawDateRange[0]} and w.created_at <= ${withdrawDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  var sql = `select w.id,w.money,w.commission_ratio,w.user_id,w.truename,
             c.truename as certificate_truename,w.withdraw_type,w.withdraw_account,
             w.withdraw_remark,w.withdraw_image,w.created_at,w.status,w.handle_at,
             w.handle_by,u.openid,u.openid_type 
             FROM withdraw_money w 
             left join users u on w.user_id=u.id
             left join certifications c on u.id=c.user_id ${filterString} 
             order by w.created_at desc`;
  const result = await query(sql);
  if (!result.fail && result instanceof Array) {
    const exportConfig = {};
    exportConfig.cols = [
      {
        caption: 'ID',
        type: 'number',
      },
      {
        caption: '用户ID',
        type: 'number',
      },
      {
        caption: '提现金额',
        type: 'string',
      },
      {
        caption: '手续费率',
        type: 'string',
      },
      {
        caption: '实际到账金额',
        type: 'string',
      },
      {
        caption: '认证真实姓名',
        type: 'string',
      },
      {
        caption: '提现真实姓名',
        type: 'string',
      },
      {
        caption: '提现方式',
        type: 'string',
      },
      {
        caption: '提现账号',
        type: 'string',
      },
      {
        caption: '收款二维码',
        type: 'string',
      },
      {
        caption: '处理人',
        type: 'string',
      },
      {
        caption: '提交事件',
        type: 'string',
      },
      {
        caption: '处理时间',
        type: 'string',
      },
      {
        caption: '状态(1.提现中;2.已提现;3.已驳回)',
        type: 'number',
      },
      {
        caption: '是否已绑定微信',
        type: 'string',
      },
    ];
    const temp = [];
    result.forEach((item) => {
      temp.push([
        item.id,
        item.user_id,
        `${item.money}元`,
        `${item.commission_ratio}%`,
        `${(item.money - (item.commission_ratio / 100) * item.money).toFixed(2)}元`,
        item.truename,
        item.certificate_truename,
        item.withdraw_type,
        item.withdraw_account,
        tools.getQiniuFullUrl(item.withdraw_image),
        item.handle_by,
        item.created_at ? moment(+item.created_at).format('YYYY-MM-DD HH:mm:ss') : '',
        item.handle_at ? moment(+item.handle_at).format('YYYY-MM-DD HH:mm:ss') : '',
        item.status,
        item.openid ? '是' : '否',
      ]);
    });
    exportConfig.rows = temp;
    req.body.excelData = { exportConfig, prefix: '提现列表' };
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null });
  }
}

// 提现驳回，把钱加回来
withdraw.reject = function(req, res, next) {
  const withdraw_remark = req.body.remark;
  const id = req.body.id;
  const userId = req.body.userId;
  const handleBy = req.body.handleBy;
  const handleAt = new Date().getTime();
  const sql = `begin;
              update users set withdraw_amount=withdraw_amount-(select money from withdraw_money where id=${id}),account_amount=account_amount+(select money from withdraw_money where id=${id}) where id=${userId};
              update withdraw_money set status=3,handle_by="${handleBy}",handle_at="${handleAt}",withdraw_remark="${withdraw_remark}" where id=${id};
              commit;`;
  console.info("提现驳回", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 设置消息内容
      req.body.message_add = {
        type: 5,
        user_id: userId,
        business_id: {withdraw_id: id},
        title: '提现申请失败',
        content: '你提交的提现申请审核不通过，赶紧看看是什么原因吧',
      }
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `驳回了ID为${id}的提现申请`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 提现通过
withdraw.resolve = async function(req, res, next) {
  const withdraw_remark = req.body.remark || '';
  const id = req.body.id;
  const handleBy = req.body.handleBy;
  const userId = req.body.userId;
  const handleAt = new Date().getTime();
  const sql = `begin;
              update users set finished_amount=finished_amount+(select money from withdraw_money where id=${id}),withdraw_amount=withdraw_amount-(select money from withdraw_money where id=${id}) where id=${userId};
              update withdraw_money set status=2,handle_by="${handleBy}",handle_at="${handleAt}",withdraw_remark="${withdraw_remark}" where id=${id};
              insert into money_stream(remark,type,money,balance,user_id,is_income,created_at) 
              values((select withdraw_type from withdraw_money where id=${id}),2,(select money from withdraw_money where id=${id}),(select account_amount from users where id=${userId}),${userId},0,"${handleAt}");
              commit;`;
  console.info("提现通过sql语句", sql);
  query(sql, async (err, vals) => {
    console.info('提现通过返回', vals);
    if (!err && vals instanceof Array) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 添加动态
      const userInfo = await UserService.getUserInfo(userId)
      const withdrawResult = await query(`select * from withdraw_money where id=${id}`)
      if (userInfo && !withdrawResult.fail && withdrawResult[0]) {
        const { nick_name, username, phone } = userInfo
        const { money } = withdrawResult[0]
        await MessageService.addDynamic(`用户${phone || nick_name || username}成功提现${money}元`)
      }
      // 设置消息内容
      req.body.message_add = {
        type: 5,
        user_id: userId,
        business_id: {withdraw_id: id},
        title: '提现申请通过',
        content: '你提交的提现申请已经审核通过，已打款，请注意查收',
      }
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `通过了ID为${id}的提现申请`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}