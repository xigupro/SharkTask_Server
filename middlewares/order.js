/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const AlipaySdk = require('alipay-sdk').default;
const aliUtil = require('alipay-sdk/lib/util');
const request = require('request');
const path = require('path');
var crypto = require('crypto');
var xmlreader = require('xmlreader');
const fs = require('fs');
const query = require('../utils/pool');
const { fixedEncodeURIComponent } = require('../utils/function');
var wepay = require('../utils/wepay');
const config = require('../config/index');
const order = {};
exports.order = order;

let alipaySdk = '';
if (config.alipay.appId) {
  alipaySdk = new AlipaySdk({
    appId: config.alipay.appId,
    privateKey: fs.readFileSync(`${process.cwd()}/key/alipay-private-key.pem`, 'ascii'),
    alipayRootCertPath: path.join(__dirname, '../key/alipayRootCert.crt'),
    appCertPath: path.join(__dirname, '../key/appCertPublicKey_2021001193638066.crt'),
    alipayPublicCertPath: path.join(__dirname, '../key/alipayCertPublicKey_RSA2.crt'),
  });
}

order.getDetail = function(req, res, next) {
  const order_id = req.body.order_id;
  const sql = `SELECT * FROM orders where order_id="${order_id}"`;
  console.info("查询订单详情", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
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

// 充值，获取会员费返回到下一个中间件
order.rechargeMoney = function(req, res, next) {
  req.body.data.money = req.body.recharge_money;
  req.body.data.body = '鲨鱼任务余额充值';
  req.body.data.notify = config.domain + '/order/rechargeMoneyNotify';
  return next();
};

// 充值支付回调
order.rechargeMoneyNotify = function(req, res, next) {
  console.info('充值支付回调', req.body.xml);
  const now = new Date().getTime();
  // 拿到微信返回的支付结果》给用户充值
  var jsonData = req.body.xml;
  if (jsonData.result_code == 'SUCCESS') {
    var key = config.wechat.mchKey;
    var stringA =
      'appid=' +
      jsonData.appid +
      '&bank_type=' +
      jsonData.bank_type +
      '&cash_fee=' +
      jsonData.cash_fee +
      '&fee_type=' +
      jsonData.fee_type +
      '&is_subscribe=' +
      jsonData.is_subscribe +
      '&mch_id=' +
      jsonData.mch_id +
      '&nonce_str=' +
      jsonData.nonce_str +
      (jsonData.openid ? '&openid=' + jsonData.openid : '') +
      '&out_trade_no=' +
      jsonData.out_trade_no +
      '&result_code=' +
      jsonData.result_code +
      '&return_code=' +
      jsonData.return_code +
      '&time_end=' +
      jsonData.time_end +
      '&total_fee=' +
      jsonData.total_fee +
      '&trade_type=' +
      jsonData.trade_type +
      '&transaction_id=' +
      jsonData.transaction_id;
    var stringSignTemp = stringA + '&key=' + key;
    var sign = crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase();
    if (sign == jsonData.sign) {
      console.info('签名校验通过');
      // 查询订单状态，假设为未付款，则更新成已付款，然后给用户充值。如果为已付款，则不充值
      const orderSql = `select * from orders where order_id="${jsonData.out_trade_no}"`;
      console.info('查询订单', orderSql);
      query(orderSql, async (orderErr, orderVals) => {
        if (!orderErr && orderVals instanceof Array) {
          if (orderVals[0].paid == 0) {
            // 如果未支付
            // 用户充值
            const user_id = orderVals[0].user_id;
            const systemInfo = await query('select * from system');
            const recharge_money = (jsonData.total_fee / 100) * ( systemInfo[0].recharge_rate / 100)
            const rechargeSql = `begin;
                                 update users set account_amount=account_amount+${recharge_money} where id=${user_id};
                                 update orders set paid=1,updated_at="${now}" where order_id="${jsonData.out_trade_no}";
                                 insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                                 values(1,${recharge_money},(select account_amount from users where id=${user_id}),${user_id},1,"${now}","微信在线充值");
                                 insert into messages(type,user_id,title,content,business_id,created_at) 
                                 values(1,1,'用户充值','用户${user_id}使用微信支付充值了${recharge_money}元','${jsonData.out_trade_no}','${now}');
                                 commit;`;
            console.info('用户充值', rechargeSql);
            query(rechargeSql, (err, vals) => {
              if (!err && vals instanceof Array) {
                if (vals[1].affectedRows) {
                  console.info('用户充值返回成功', vals);
                } else {
                  console.info('用户不存在');
                }
              } else {
                console.info('充值出错', err);
              }
            })
          }
        } else {
          console.info('查询订单出错');
        }
      });
      var sendData = {
        return_code: 'SUCCESS',
        return_msg: 'OK',
      };
      res.end(wepay.json2Xml(sendData));
    } else {
      console.info('签名校验不通过');
      return next();
    }
  }
};

// 下单
order.add = function(req, res, next) {
  // 从上一个中间件拿到的会数据
  let money = req.body.data.money;
  //首先拿到前端传过来的参数
  let openid = req.body.data.openid;
  let unionid = req.body.data.unionid;
  let filter = '';
  if (unionid) {
    filter = `unionid="${unionid}"`;
  } else if (openid) {
    filter = `openid="${openid}"`;
  }
  let orderCode = new Date().getTime();
  console.log(
    'APP传过来的参数是',
    openid +
      '----' +
      orderCode +
      '----' +
      money +
      '----' +
      config.wechat.appId +
      '-----' +
      config.wechat.appSecret +
      '-----' +
      config.wechat.mchId +
      '-----' +
      config.wechat.mchKey,
  );

  //首先生成签名sign
  // appid
  let mch_id = config.wechat.mchId;
  let nonce_str = wepay.createNonceStr();
  let timestamp = wepay.createTimeStamp();
  let body = req.body.data.body;
  let out_trade_no = orderCode;
  let total_fee = wepay.getmoney(money);
  let spbill_create_ip =
    req.connection.remoteAddress === '::1'
      ? '127.0.0.1'
      : req.connection.remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
  let notify_url = req.body.data.notify;
  let trade_type = 'JSAPI'; // 'APP';公众号：'JSAPI'或'NATIVE'

  let sign = wepay.paysignjsapi(
    config.wechat.appId,
    body,
    mch_id,
    nonce_str,
    notify_url,
    openid,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    trade_type,
    config.wechat.mchKey,
  );

  console.log('sign==', sign);

  //组装xml数据
  var formData = '<xml>';
  formData += '<appid>' + config.wechat.appId + '</appid>'; //appid
  formData += '<body><![CDATA[' + body + ']]></body>';
  formData += '<mch_id>' + mch_id + '</mch_id>'; //商户号
  formData += '<nonce_str>' + nonce_str + '</nonce_str>'; //随机字符串，不长于32位。
  formData += '<notify_url>' + notify_url + '</notify_url>';
  formData += '<openid>' + openid + '</openid>';
  formData += '<out_trade_no>' + out_trade_no + '</out_trade_no>';
  formData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>';
  formData += '<total_fee>' + total_fee + '</total_fee>';
  formData += '<trade_type>' + trade_type + '</trade_type>';
  formData += '<sign>' + sign + '</sign>';
  formData += '</xml>';

  console.log('formData===', formData);

  var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

  request({ url: url, method: 'POST', body: formData }, function(
    err,
    response,
    body,
  ) {
    console.info('下单返回', body);
    if (!err && response.statusCode == 200) {
      xmlreader.read(body.toString('utf-8'), function(errors, response) {
        if (errors !== null) {
          return res.json({
            code: '10008',
            message: errors,
            success: false,
            data: null,
          });
        }
        if (response.xml.result_code.text() === 'FAIL') {
          return res.json({
            code: '10008',
            message: response.xml.err_code_des.text(),
            success: false,
            data: null,
          });
        }
        console.log('长度===', response.xml.prepay_id.text().length);
        var prepay_id = response.xml.prepay_id.text();
        console.log('解析后的prepay_id==', prepay_id);

        //将预支付订单和其他信息一起签名后返回给前端
        let package = 'prepay_id=' + prepay_id;
        let signType = 'MD5';
        let minisign = wepay.paysignjsapimini(
          config.wechat.appId,
          nonce_str,
          package,
          signType,
          timestamp,
          config.wechat.mchKey,
        );

        // 将订单记录到数据库
        const addSql = `insert into orders(order_id,user_id,paid,money,created_at)
                     values(
                       "${out_trade_no}",
                       (select id from users where ${filter}),
                       0,
                       ${total_fee},
                       "${orderCode}")`;
        console.info("新增订单", addSql);
        query(addSql, (addErr, vals) => {
          if (!addErr && vals instanceof Object) {
            // 下单成功，返回参数给小程序端支付
            res.end(
              JSON.stringify({
                status: '10000',
                success: true,
                data: {
                  appId: config.wechat.appId,
                  partnerId: mch_id,
                  prepayId: prepay_id,
                  nonceStr: nonce_str,
                  timeStamp: timestamp,
                  package: 'Sign=WXPay',
                  paySign: minisign,
                  orderId: out_trade_no,
                },
              }),
            );
          } else {
            return res.json({ code: '10001', message: addErr.message, success: false, data: addErr }); 
          }
        })
        
      });
    }
  });
};


// APP微信支付下单
order.appAdd = function(req, res, next) {
  // 从上一个中间件拿到的会数据
  let money = req.body.money;
  const user_id = req.body.user_id;
  let notify_url = req.body.notify_url;
  let body = req.body.remark;
  let orderCode = new Date().getTime();
  console.log(
    'APP传过来的参数是',
      '----' +
      orderCode +
      '----' +
      money +
      '----' +
      config.wechat.open.appId +
      '-----' +
      config.wechat.open.appSecret +
      '-----' +
      config.wechat.mchId +
      '-----' +
      config.wechat.mchKey,
  );

  //首先生成签名sign
  // appid
  let mch_id = config.wechat.mchId;
  let nonce_str = wepay.createNonceStr();
  let timestamp = wepay.createTimeStamp();
  let out_trade_no = orderCode;
  let total_fee = wepay.getmoney(money);
  let spbill_create_ip =
    req.connection.remoteAddress === '::1'
      ? '127.0.0.1'
      : req.connection.remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
  
  let trade_type = 'APP'; // 'APP';公众号：'JSAPI'或'NATIVE'

  let sign = wepay.paysignjsapi(
    config.wechat.open.appId,
    body,
    mch_id,
    nonce_str,
    notify_url,
    null,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    trade_type,
    config.wechat.mchKey,
  );

  console.log('sign==', sign);

  //组装xml数据
  var formData = '<xml>';
  formData += '<appid>' + config.wechat.open.appId + '</appid>'; //appid
  formData += '<body><![CDATA[' + body + ']]></body>';
  formData += '<mch_id>' + mch_id + '</mch_id>'; //商户号
  formData += '<nonce_str>' + nonce_str + '</nonce_str>'; //随机字符串，不长于32位。
  formData += '<notify_url>' + notify_url + '</notify_url>';
  formData += '<out_trade_no>' + out_trade_no + '</out_trade_no>';
  formData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>';
  formData += '<total_fee>' + total_fee + '</total_fee>';
  formData += '<trade_type>' + trade_type + '</trade_type>';
  formData += '<sign>' + sign + '</sign>';
  formData += '</xml>';

  console.log('formData===', formData);

  var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

  request({ url: url, method: 'POST', body: formData }, function(
    err,
    response,
    body,
  ) {
    console.info('下单返回', body);
    if (!err && response.statusCode == 200) {
      xmlreader.read(body.toString('utf-8'), function(errors, response) {
        if (errors !== null) {
          return res.json({
            code: '10008',
            message: errors,
            success: false,
            data: null,
          });
        }
        if (response.xml.result_code.text() === 'FAIL') {
          return res.json({
            code: '10008',
            message: response.xml.err_code_des.text(),
            success: false,
            data: null,
          });
        }
        console.log('长度===', response.xml.prepay_id.text().length);
        var prepay_id = response.xml.prepay_id.text();
        console.log('解析后的prepay_id==', prepay_id);

        //将预支付订单和其他信息一起签名后返回给前端
        let appsign = wepay.paysignjsapiapp(
          config.wechat.open.appId,
          mch_id,
          prepay_id,
          nonce_str,
          timestamp,
          'Sign=WXPay',
          config.wechat.mchKey,
        );

        // 将订单记录到数据库
        const addSql = `insert into orders(order_id,user_id,paid,money,created_at)
                     values(
                       "${out_trade_no}",
                       ${user_id},
                       0,
                       ${total_fee},
                       "${orderCode}")`;
        console.info("新增订单", addSql);
        query(addSql, (addErr, vals) => {
          console.info('新增APP支付订单返回', addErr, vals);
          if (!addErr && vals instanceof Object) {
            // 下单成功，返回参数给APP端支付
            res.end(
              JSON.stringify({
                code: '10000',
                success: true,
                data: {
                  appid: config.wechat.open.appId,
                  noncestr: nonce_str,
                  package: "Sign=WXPay",
                  partnerid: mch_id,
                  prepayid: prepay_id,
                  timestamp: timestamp,
                  sign: appsign,
                },
              }),
            );
          } else {
            return res.json({ code: '10001', message: addErr.message, success: false, data: addErr }); 
          }
        })
        
      });
    }
  });
};

// 公众号下单
order.publicAdd = function(req, res, next) {
  let money = req.body.money;
  const user_id = req.body.user_id;
  let notify_url = req.body.notify_url;
  let body = req.body.remark;
  let openid = req.body.openId;

  let orderCode = new Date().getTime();
  console.log(
    '公众号网页传过来的参数是',
    openid +
      '----' +
      orderCode +
      '----' +
      money +
      '----' +
      config.wechat.officialAccount.appId +
      '-----' +
      config.wechat.officialAccount.appSecret +
      '-----' +
      config.wechat.mchId +
      '-----' +
      config.wechat.mchKey,
  );

  //首先生成签名sign
  // appid
  let mch_id = config.wechat.mchId;
  let nonce_str = wepay.createNonceStr();
  let timestamp = wepay.createTimeStamp();
  let out_trade_no = orderCode;
  let total_fee = wepay.getmoney(money);
  let spbill_create_ip =
    req.connection.remoteAddress === '::1'
      ? '127.0.0.1'
      : req.connection.remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
  let trade_type = 'JSAPI'; // 'APP';公众号：'JSAPI'或'NATIVE'

  let sign = wepay.paysignjsapi(
    config.wechat.officialAccount.appId,
    body,
    mch_id,
    nonce_str,
    notify_url,
    openid,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    trade_type,
    config.wechat.mchKey,
  );

  console.log('sign==', sign);

  //组装xml数据
  var formData = '<xml>';
  formData += '<appid>' + config.wechat.officialAccount.appId + '</appid>'; //appid
  formData += '<body><![CDATA[' + body + ']]></body>';
  formData += '<mch_id>' + mch_id + '</mch_id>'; //商户号
  formData += '<nonce_str>' + nonce_str + '</nonce_str>'; //随机字符串，不长于32位。
  formData += '<notify_url>' + notify_url + '</notify_url>';
  formData += '<openid>' + openid + '</openid>';
  formData += '<out_trade_no>' + out_trade_no + '</out_trade_no>';
  formData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>';
  formData += '<total_fee>' + total_fee + '</total_fee>';
  formData += '<trade_type>' + trade_type + '</trade_type>';
  formData += '<sign>' + sign + '</sign>';
  formData += '</xml>';

  console.log('formData===', formData);

  var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

  request({ url: url, method: 'POST', body: formData }, function(
    err,
    response,
    body,
  ) {
    console.info('下单返回', body);
    if (!err && response.statusCode == 200) {
      xmlreader.read(body.toString('utf-8'), function(errors, response) {
        if (errors !== null) {
          return res.json({
            code: '10008',
            message: errors,
            success: false,
            data: null,
          });
        }
        if (response.xml.result_code.text() === 'FAIL') {
          return res.json({
            code: '10008',
            message: response.xml.err_code_des.text(),
            success: false,
            data: null,
          });
        }
        console.log('长度===', response.xml.prepay_id.text().length);
        var prepay_id = response.xml.prepay_id.text();
        console.log('解析后的prepay_id==', prepay_id);

        //将预支付订单和其他信息一起签名后返回给前端
        let package = 'prepay_id=' + prepay_id;
        let signType = 'MD5';
        let minisign = wepay.paysignjsapimini(
          config.wechat.officialAccount.appId,
          nonce_str,
          package,
          signType,
          timestamp,
          config.wechat.mchKey,
        );

        // 将订单记录到数据库
        const addSql = `insert into orders(order_id,user_id,paid,money,created_at)
                        values(
                          "${out_trade_no}",
                          ${user_id},
                          0,
                          ${total_fee},
                          "${orderCode}")`;
        console.info("新增订单", addSql);
        query(addSql, (addErr, vals) => {
          if (!addErr && vals instanceof Object) {
            // 下单成功，返回参数给小程序端支付
            res.end(
              JSON.stringify({
                code: '10000',
                success: true,
                data: {
                  appId: config.wechat.officialAccount.appId,
                  partnerId: mch_id,
                  prepayId: prepay_id,
                  nonceStr: nonce_str,
                  timeStamp: timestamp,
                  package: 'Sign=WXPay',
                  paySign: minisign,
                  orderId: out_trade_no,
                },
              }),
            );
          } else {
            return res.json({ code: '10001', message: addErr.message, success: false, data: addErr }); 
          }
        })
        
      });
    }
  });
};

// 获取小程序openid
order.session = function(req, res, next) {
  let APPID = config.wechat.appId;
  let SECRET = config.wechat.appSecret;
  let CODE = req.body.wechatCode;
  console.info('获取openid请求参数', req.body);
  let url =
    'https://api.weixin.qq.com/sns/jscode2session?appid=' +
    APPID +
    '&secret=' +
    SECRET +
    '&js_code=' +
    CODE +
    '&grant_type=authorization_code';
  const params = { url: url, method: 'GET' };
  request(params, function(err, res, body) {
    if (body.errcode) {
      return res.json({
        code: '10001',
        message: body.errmsg,
        success: false,
        data: body,
      });
    } else {
      body = JSON.parse(body);
      console.info('获取openid返回', body);
      req.body.data = Object.assign(body, req.body.data);
      return next();
    }
  });
};

// 获取公众号openid
order.officialSession = function(req, res, next) {
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
  console.info('微信公众号授权请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信公众号授权返回参数：', data);
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
}

// 支付宝下单
order.alipayAdd = function(req, res, next) {
  const money = req.body.money;
  const name = req.body.name;
  const notify_url = req.body.notify_url;
  const user_id = req.body.user_id;
  const now = new Date().getTime();
  if (config.alipay.appId) {
      const params = {
        bizContent: {
          out_trade_no: `${now}`,
          subject: encodeURIComponent(name),
          total_amount: money,
          body: encodeURIComponent(name),
          notifyUrl: notify_url,
        }
      }
      const config = alipaySdk.config;
      const signData = aliUtil.sign('alipay.trade.app.pay', params, config);
      const { url,  execParams } = alipaySdk.formatUrl('', signData);
      const orderInfo = (url + '&biz_content=' + encodeURIComponent(execParams.biz_content)).substr(1);
      console.info('支付宝下单：', orderInfo);
      // 将订单记录到数据库
      const addSql = `insert into orders(order_id,user_id,paid,money,created_at,pay_from)
            values(
              "${now}",
              ${user_id},
              0,
              ${money},
              "${now}",
              2)`;
      console.info("新增订单", addSql);
      query(addSql, (addErr, vals) => {
        console.info('新增APP支付订单返回', addErr, vals);
        if (!addErr && vals instanceof Object) {
          // 下单成功，返回参数给APP端支付
          req.body.data = orderInfo;
          req.body.code = '10000';
          req.body.message = '操作成功';
          req.body.success = true;
          return next();
        } else {
          return res.json({ code: '10001', message: addErr.message, success: false, data: addErr }); 
        }
      })
  } else {
    return res.json({ code: '10001', message: '请配置支付宝支付信息', success: false, data: null });
  }
}

// 支付宝充值回调
order.alipayRechargeNotify = function(req, res, next) {
  const jsonData = req.body;
  console.info('支付宝充值回调', jsonData);
  if (alipaySdk.checkNotifySign(jsonData)) {
    console.info('支付宝充值回调验签成功');
    const tradeStatus = req.body.trade_status;
    if (tradeStatus === 'TRADE_FINISHED' || tradeStatus === 'TRADE_SUCCESS') {
      //交易状态TRADE_FINISHED的通知触发条件是商户签约的产品不支持退款功能的前提下，买家付款成功；
      // 或者，商户签约的产品支持退款功能的前提下，交易已经成功并且已经超过可退款期限。
      //状态TRADE_SUCCESS的通知触发条件是商户签约的产品支持退款功能的前提下，买家付款成功
      
      // 查询订单状态，假设为未付款，则更新成已付款，然后给用户充值。如果为已付款，则不充值
      const orderSql = `select * from orders where order_id="${jsonData.out_trade_no}"`;
      const now = new Date().getTime();
      console.info('查询订单', orderSql);
      query(orderSql, async (orderErr, orderVals) => {
        if (!orderErr && orderVals instanceof Array) {
          if (orderVals[0].paid == 0) {
            // 如果未支付
            // 将订单更新为已支付
            const user_id = orderVals[0].user_id;
            const systemInfo = await query('select * from system');
            const recharge_money = jsonData.total_amount * ( systemInfo[0].recharge_rate / 100)
            const rechargeSql = `begin;
                                 update users set account_amount=account_amount+${recharge_money} where id=${user_id};
                                 update orders set paid=1,updated_at="${now}" where order_id="${jsonData.out_trade_no}";
                                 insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                                 values(1,${recharge_money},(select account_amount from users where id=${user_id}),${user_id},1,"${now}","支付宝在线充值");
                                 insert into messages(type,user_id,title,content,business_id,created_at) 
                                 values(1,1,'用户充值','用户${user_id}使用支付宝支付充值了${recharge_money}元','${jsonData.out_trade_no}','${now}');
                                 commit;`;
            console.info('用户支付宝充值', rechargeSql);
            query(rechargeSql, (err, vals) => {
              if (!err && vals instanceof Array) {
                if (vals[1].affectedRows) {
                  console.info('用户支付宝充值返回成功', vals);
                } else {
                  console.info('用户不存在');
                }
              } else {
                console.info('充值出错');
              }
            })
          }
        } else {
          console.info('查询订单出错');
        }
      });
      res.end('success');
    } else if (tradeStatus === 'WAIT_BUYER_PAY') {

    } else if (tradeStatus === 'TRADE_CLOSED') {

    }
  } else {
    res.end('false');
  }
}

// 支付宝商户单笔转账至支付宝
order.alipayPayToAccount = async function(req, res, next) {
  let id = req.body.id; // 提现列表的ID
  let user_id = req.body.userId;
  let amount = req.body.money;
  amount = Number(amount);
  const systemResult = await query('select pay_to_alipay from system');
  const withdrawResult = await query(`select * from withdraw_money where id=${id}`);
  if (withdrawResult.fail) {
    return res.json({ code: '10001', message: '提现信息不存在', success: false, data: null});
  }
  if (Number.isNaN(amount) || amount === 0) {
    return res.json({ code: '10001', message: '金额不合法', success: false, data: null});
  }
  amount = amount.toFixed(2);
  if (!systemResult.fail && systemResult instanceof Array) {
    if (systemResult[0].pay_to_alipay && withdrawResult[0].withdraw_account && withdrawResult[0].withdraw_type === '支付宝') {
      // 后台开启了商户转账至支付宝，且用户填写了支付宝、提现类型为支付宝
      if (!(user_id && amount)) {
        return res.json({ code: '10001', message: '参数不正确', success: false, data: null});
      }
    } else {
      return next();
    }
  }
  if (config.alipay.appId) {
    const now = new Date().getTime();
    const params = {
      bizContent: {
        out_biz_no: `${now}`,
        trans_amount: amount,
        product_code: 'TRANS_ACCOUNT_NO_PWD',
        biz_scene: 'DIRECT_TRANSFER',
        payee_info: {
          identity: withdrawResult[0].withdraw_account,
          identity_type: 'ALIPAY_LOGON_ID',
          name: withdrawResult[0].truename,
        },
        order_title: `${id}:用户${user_id}提现到余额`,
      }
    }
    const result = await alipaySdk.exec('alipay.fund.trans.uni.transfer', params);
    console.info('支付宝商户单笔转账至支付宝：', params, result);
    if (result.status === 'SUCCESS') {
      await query(`insert into orders(pay_from,order_id,user_id,paid,money,created_at,direction) 
        values(2,'${result.outBizNo}',${user_id},1,${amount},'${now}',2)`);
      return next();
    } else {
      return res.json({
        code: '10016',
        message: `${result.msg}。${result.subMsg}`,
        success: false,
        data: result,
      });
    }
  } else {
    return res.json({ code: '10001', message: '请配置支付宝支付信息', success: false, data: null });
  }
}

// 接收闲玩订单
order.xianwan = async function(req, res, next) {
  const {
    adid, adname, appid, ordernum, dlevel, pagename, atype, deviceid, simid, appsign, merid, event, adicon, price, money, itime, keycode
  } = req.query;
  const result = await query(`select id from xianwan_orders where ordernum="${ordernum}"`);
  if (result instanceof Array && result.length) {
    // 订单之前已存在
    res.json({"success": 1,"message": "订单已接收"});
  } else {
    const str = `${adid}${appid}${ordernum}${dlevel}${deviceid}${appsign}${price}${money}${config.xianwan[appid]}`;
    const md5String = crypto.createHash('md5').update(str, 'utf-8').digest('hex').toUpperCase();
    console.info('闲玩传过来的参数', req.query);
    if (md5String === keycode) {
      const created_at = new Date().getTime();
      const sql = `begin;
                   insert into xianwan_orders(adid, adname, appid, ordernum, dlevel, pagename, atype, deviceid, simid, appsign, merid, event, adicon, price, money, itime, keycode) 
                    values(${adid}, '${adname}', '${appid}', '${ordernum}', ${dlevel}, '${pagename}', ${atype}, '${deviceid}', '${simid}', '${appsign}', '${merid}', '${event}', '${adicon}', '${price}', '${money}', '${itime}', '${keycode}');
                   update users set account_amount=account_amount+${+money} where id=${appsign};
                   insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                    values(3,${+money},(select account_amount from users where id=${appsign}),${appsign},1,"${created_at}","闲玩佣金");
                   commit;`
      console.info('闲玩', sql);
      const insertResult = await query(sql);
      if (insertResult instanceof Array
          && insertResult[1].insertId
          && insertResult[2].affectedRows
          && insertResult[3].insertId) {
        // 接收成功
        res.json({"success": 1,"message": "接收成功"});
      } else {
        res.json({"success": 0,"message": "接收失败"});
      }
    } else {
      res.json({"success": 0,"message": "非法参数"});
    }
  }
}

// 接收鱼玩订单
order.yuwan = async function(req, res, next) {
  const { orderNo, rewardDataJson, sign, time } = req.body;
  const result = await query(`select id from yuwan_orders where ordernum="${orderNo}"`);
  if (result instanceof Array && result.length) {
    // 订单之前已存在
    res.json({"code": 1, "msg": "已接收过了"});
  } else {
    const str = `${rewardDataJson}${time}${config.yuwan.appSecret}`;
    const md5String = crypto.createHash('md5').update(str, 'utf-8').digest('hex').toUpperCase();
    console.info('鱼玩传过来的参数', req.body);
    if (md5String === sign.toUpperCase()) {
      const created_at = new Date().getTime();
      const reward = JSON.parse(rewardDataJson);
      const sql = `begin;
                   insert into yuwan_orders(
                    advert_name,
                    reward_rule,
                    stage_id,
                    stage_num,
                    advert_icon,
                    reward_type,
                    is_subsidy,
                    media_money,
                    reward_user_rate,
                    currency_rate,
                    user_money,
                    user_currency,
                    media_user_id,
                    received_time,
                    order_no,
                    sign
                   ) 
                    values(
                      '${reward.advertName}',
                      '${reward.rewardRule}',
                      ${reward.stageId},
                      '${reward.stageNum}',
                      '${reward.advertIcon}',
                      '${reward.rewardType}',
                      ${reward.isSubsidy},
                      ${reward.mediaMoney},
                      ${reward.rewardUserRate},
                      ${reward.currencyRate},
                      ${reward.userMoney},
                      ${reward.userCurrency},
                      '${reward.mediaUserId}',
                      '${reward.receivedTime}',
                      '${orderNo}',
                      '${sign}');
                   update users set account_amount=account_amount+${+reward.userMoney} where id=${reward.mediaUserId};
                   insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                    values(3,${+reward.userMoney},(select account_amount from users where id=${reward.mediaUserId}),${reward.mediaUserId},1,"${created_at}","鱼玩佣金");
                   commit;`
      console.info('鱼玩', sql);
      const insertResult = await query(sql);
      if (insertResult instanceof Array
          && insertResult[1].insertId
          && insertResult[2].affectedRows
          && insertResult[3].insertId) {
        // 接收成功
        res.json({"code": 0, "msg": ""});
      } else {
        res.json({"code": 2, "msg": "未知错误"});
      }
    } else {
      res.json({"code": 2, "msg": "非法参数"});
    }
  }
}

// 接收多游订单
order.duoyou = async function(req, res, next) {
  const { order_id, advert_id, advert_name, created, media_income, member_income, media_id, user_id, device_id, content, sign } = req.query;
  const result = await query(`select id from duoyou_orders where order_id="${order_id}"`);
  if (result instanceof Array && result.length) {
    // 订单之前已存在
    res.json({"status_code": "200", "message": "已接收过了"});
  } else {
    const str = `advert_id=${advert_id}&advert_name=${fixedEncodeURIComponent(advert_name)}&content=${fixedEncodeURIComponent(content)}&created=${created}&device_id=${device_id}&media_id=${media_id}&media_income=${media_income}&member_income=${member_income}&order_id=${order_id}&user_id=${user_id}&key=${config.duoyou[media_id]}`;
    const md5String = crypto.createHash('md5').update(str, 'utf-8').digest('hex').toUpperCase();
    console.info('多游传过来的参数', req.query);
    if (md5String === sign.toUpperCase()) {
      const created_at = new Date().getTime();
      const sql = `begin;
                   insert into duoyou_orders(
                    order_id, advert_id, advert_name, created, media_income, member_income, media_id, user_id, device_id, content, sign
                   ) 
                    values(
                      '${order_id}',
                      ${advert_id},
                      '${advert_name}',
                      '${created}',
                      ${media_income},
                      ${member_income},
                      '${media_id}',
                      '${user_id}',
                      '${device_id}',
                      '${content}',
                      '${sign}');
                   update users set account_amount=account_amount+${+member_income} where id=${user_id};
                   insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
                    values(3,${+member_income},(select account_amount from users where id=${user_id}),${user_id},1,"${created_at}","多游佣金");
                   commit;`
      console.info('多游', sql);
      const insertResult = await query(sql);
      if (insertResult instanceof Array
          && insertResult[1].insertId
          && insertResult[2].affectedRows
          && insertResult[3].insertId) {
        // 接收成功
        res.json({"status_code": "200", "message": ""});
      } else {
        res.json({"status_code": "400", "message": "未知错误"});
      }
    } else {
      res.json({"status_code": "403", "message": "签名sign错误"});
    }
  }
}

// 红包订单
order.red = async function(req, res, next) {
  const { from_user, to_user, money, pay_from = 1, remark } = req.body;
  const createdAt = new Date().getTime();

  if (req.body.data.account_amount < money) {
    // 红包金额大于用户余额
    return res.json({ code: '10001', message: '余额不足', success: false, data: null }); 
  }
  const sql = `begin;
               insert into red_orders(from_user,to_user,money,pay_from,remark,created_at)
                values(${from_user},${to_user},${money},${pay_from},'${remark}',${createdAt});
               update users set account_amount=account_amount-${money} where id=${from_user};
               commit;`;
  const result = await query(sql, null, null, '新增红包订单');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[1].insertId;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `添加了ID为${result[1].insertId}的红包订单`,
    });
    query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
    values(4,${money},(select account_amount from users where id=${from_user}),${from_user},0,"${createdAt}","发出ID为${result[1].insertId}的红包，共${money}元");`)
    return next();
  } else {
    return res.json({ code: '10001', message: result[1].message, success: false, data: null }); 
  }
}

// 红包订单详情
order.redDetail = async function(req, res, next) {
  const { id } = req.body;
  const sql = `select * from red_orders where id = ${id}`;
  const result = await query(sql, null, null, '查询红包订单');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[0];
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 红包领取
order.redReceive = async function(req, res, next) {
  const { id, money, to_user } = req.body;
  const now = new Date().getTime();
  const sql = `begin;
               update red_orders set status=2, updated_at='${now}' where id=${id} and status=1;
               update users set account_amount=account_amount+${money} where id=${to_user};
               commit;`;
  const result = await query(sql, null, null, '领取红包');
  if (!result.fail && result instanceof Array) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `领取了ID为${id}的红包`,
    });
    query(`insert into money_stream(type,money,balance,user_id,is_income,created_at,remark) 
    values(3,${money},(select account_amount from users where id=${to_user}),${to_user},0,"${now}","领取ID为${id}的红包，共${money}元");`)
    return next();
  } else {
    return res.json({ code: '10001', message: '领取失败', success: false, data: null }); 
  }
}