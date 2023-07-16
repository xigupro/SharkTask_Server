var xmlreader = require('xmlreader');
let xml2js = require('xml2js');
let fs = require('fs');
const request = require('request');
const query = require('../utils/pool');
const config = require('../config/index');
const { userInfo } = require('os');

var wepay = {
  // 把json转为xml
  json2Xml: function (json) {
    let _xml = '';
    Object.keys(json).map((key) => {
      _xml += `<${key}>${json[key]}</${key}>`;
    });
    return `<xml>${_xml}</xml>`;
  },
  //把金额转为分
  getmoney: function (money) {
    return Math.floor(parseFloat(money) * 100);
  },

  // 随机字符串产生函数
  createNonceStr: function () {
    return Math.random().toString(36).substr(2, 15);
  },

  // 时间戳产生函数
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + '';
  },

  //签名加密算法
  paysignjsapi: function (
    appid,
    body,
    mch_id,
    nonce_str,
    notify_url,
    openid,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    trade_type,
    mchkey,
  ) {
    var ret = {
      appid: appid,
      mch_id: mch_id,
      nonce_str: nonce_str,
      body: body,
      notify_url: notify_url,
      out_trade_no: out_trade_no,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: trade_type,
    };
    if (openid) {
      ret.openid = openid;
    }
    console.log('ret==', ret);
    var string = raw(ret);
    var key = mchkey;
    string = string + '&key=' + key;
    console.log('string=', string);
    var crypto = require('crypto');
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase();
  },
  // 小程序签名
  paysignjsapimini: function (
    appId,
    nonceStr,
    package,
    signType,
    timestamp,
    mchkey,
  ) {
    var ret = {
      appId: appId,
      nonceStr: nonceStr,
      package: package,
      signType: signType,
      timeStamp: timestamp,
    };
    console.log('Miniret==', ret);
    var string = raw(ret);
    var key = mchkey;
    string = string + '&key=' + key;
    console.log('Ministring>>>>>>', string);
    var crypto = require('crypto');
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase();
  },
  // app签名
  paysignjsapiapp: function (
    appid,
    partnerid,
    prepayid,
    noncestr,
    timestamp,
    package,
    mchkey,
  ) {
    var ret = {
      appid: appid,
      partnerid: partnerid,
      prepayid: prepayid,
      noncestr: noncestr,
      timestamp: timestamp,
      package: package,
    };
    console.log('Miniret==', ret);
    var string = raw(ret);
    var key = mchkey;
    string = string + '&key=' + key;
    console.log('Ministring>>>>>>', string);
    var crypto = require('crypto');
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase();
  },
  getXMLNodeValue: function (xml) {
    xmlreader.read(xml, function (errors, response) {
      if (null !== errors) {
        console.log(errors);
        return;
      }
      console.log('长度===', response.xml.prepay_id.text().length);
      var prepay_id = response.xml.prepay_id.text();
      console.log('解析后的prepay_id==', prepay_id);
      return prepay_id;
    });
  },
  // 以下是企业付款到微信余额相关方法
  /*生成url串用于微信md5校验*/
  fnCreateUrlParam: function (json) {
    let _arr = [];
    for (let key in json) {
      _arr.push(key + '=' + json[key]);
    }
    return _arr.join('&');
  },
  /*生成付款xml参数数据*/
  fnGetWeixinBonus: function (option) {
    console.log('option===', option);
    let amount = option.amount || 100; //红包总金额
    let openid = option.openid; // '可以修改成你自己的openid，这样如果出错就会发送到你的账户上面了';//红包发送的目标用户
    let openid_type = option.openid_type;
    let now = new Date();
    let clientIp = option.clientIp; //ip地址
    let desc = option.wishing; //企业付款备注
    let mch_id = config.wechat.mchId; //商户号
    let mch_appid = ''; //appid
    switch (Number(openid_type)) {
      case 1:
        // 小程序
        mch_appid = config.wechat.appId;
        break;
      case 2:
        // 公众号
        mch_appid = config.wechat.officialAccount.appId;
        break;
      case 3:
        // APP
        mch_appid = config.wechat.open.appId;
        break;
      default:
        // 此配置是旧版本遗留
        mch_appid = config.wechat.mchAppId; 
        break;
    }
    let wxkey = config.wechat.mchKey; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
    let date_time =
      now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate();
    let date_no = (now.getTime() + '').substr(-8); //生成8为日期数据，精确到毫秒
    let random_no = Math.floor(Math.random() * 99);
    if (random_no < 10) {
      //生成位数为2的随机码
      random_no = '0' + random_no;
    }

    let nonce_str = Math.random().toString(36).substr(2, 15); //生成随机字符串
    let partner_trade_no = mch_id + date_time + date_no + random_no; //生成商户订单号

    let contentJson = {};
    contentJson.amount = amount; // '100';
    contentJson.check_name = 'NO_CHECK'; // '强制验证名字';FORCE_CHECK
    contentJson.desc = desc; //'恭喜发财';
    contentJson.mch_appid = mch_appid; //商户appid
    contentJson.mchid = mch_id;
    contentJson.nonce_str = nonce_str;
    contentJson.openid = openid; // 'oovyt4u9yTamaCAxlZ-U2HjH-Z'; //墨色梧桐的openid // 'oovyt4u9yTamaCAxlZ-U2HjH-Z';
    contentJson.partner_trade_no = partner_trade_no; //订单号为 mch_id + yyyymmdd+10位一天内不能重复的数字; //+201502041234567893';
    contentJson.spbill_create_ip = clientIp; //IP地址
    contentJson.key = wxkey; //微信安全密钥

    /*生成url串用于微信md5校验*/
    let contentStr = wepay.fnCreateUrlParam(contentJson);
    console.log('content=' + contentStr);
    //生成签名
    let crypto = require('crypto');
    contentJson.sign = crypto
      .createHash('md5')
      .update(contentStr, 'utf8')
      .digest('hex')
      .toUpperCase();

    //删除 contentJson对象中的key (key不参与签名)
    delete contentJson.key;
    //生成xml函数
    let xmlData = wepay.json2Xml(contentJson);
    return xmlData;
  },
  //微信企业支付到零钱中间件
  wxcompay: async (req, res, next) => {
    let id = req.body.id; // 提现列表的ID
    let amount = req.body.money; //金额
    let openid = req.body.openid;
    let openid_type = req.body.openid_type;
    let user_id = req.body.userId;
    let wishing = req.body.wishing || `${id}:用户${user_id}提现到余额`; // 备注
    let clientIp =
      req.body.clientIp || req.ip.match(/\d+\.\d+\.\d+\.\d+/) || '127.0.0.1';
    const result = await query('select pay_to_wechat from system');
    if (result instanceof Object) {
      if (result[0].pay_to_wechat && openid) {
        if (!(user_id && amount)) {
          return res.json({ code: '10001', message: '参数不正确', success: false, data: null});
        }
      } else {
        return next();
      }
    }
    // 提现金额精确到角
    amount = Number(amount).toFixed(1);
    // 按微信要求转化成分
    amount = amount * 100;
    // 解决js浮点运算问题
    amount = amount.toFixed();
    let sendData = wepay.fnGetWeixinBonus({
      amount: Number(amount),
      openid,
      openid_type,
      wishing,
      clientIp,
    });
    let now = new Date().getTime();
    console.log('付款到余额sendData=====', sendData);
    //读取微信生成的证书用作加密
    let opt = {
      url:
        'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
      body: sendData,
      key: fs.readFileSync(`${process.cwd()}/key/apiclient_key.pem`), //将微信生成的证书放入 cert目录下
      cert: fs.readFileSync(`${process.cwd()}/key/apiclient_cert.pem`),
    };
    request.post(opt, function (err, response, body) {
      console.log('付款到余额err==', err);
      console.log('付款到余额body==', body);
      let parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        explicitRoot: false,
      }); //解析签名结果xml转json
      parser.parseString(body, async (error, result) => {
        console.log('付款到余额res==', result);
        if (result && result.result_code == 'SUCCESS') {
          await query(`insert into orders(order_id,user_id,paid,money,created_at,direction) 
            values('${result.partner_trade_no}',${user_id},1,${amount},'${now}',2)`);
          return next();
        } else {
          return res.json({
            code: '10016',
            message: result.err_code_des,
            success: false,
            data: result,
          });
        }
      });
    });
  },
};
function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function(key) {
    newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

module.exports = wepay;
