/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const Core = require('@alicloud/pop-core');
const config = require('../config/index');
const sms = {};
exports.sms = sms;

sms.send = function(req, res, next) {
  const phone = req.body.phone;
  const number = 100000 + Math.floor(Math.random() * 900000);
  if (process.env.NODE_ENV === 'development') {
    // 开发环境不发短信
    global.redisClient.set(
      phone,
      888888,
      'EX',
      300
    );
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    var client = new Core({
      accessKeyId: config.aliyun.accessKey,
      accessKeySecret: config.aliyun.secretKey,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
    var params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": phone, // 电话号码
      "SignName": config.aliyun.sms.signName, // 你的短信签名
      "TemplateCode": config.aliyun.sms.templateCode, // 你的短信模板代码
      "TemplateParam": `{'code':${number}}` // 短信模板变量对应的实际值，JSON格式
    }
    console.info('验证码', number);
    // 将验证码存到redis
    global.redisClient.set(
      phone,
      number,
      'EX',
      600
    );
    client.request('SendSms', params, { method: 'POST' }).then((res) => {
      console.log('发送验证码返回', JSON.stringify(res));
      if (res.Code === 'OK') {
        req.body.data = true;
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        return next();
      } else {
        return res.json({ code: '10012', message: res.Message, success: false, data: null }); 
      }
    }, (ex) => {
      console.info('验证码发送失败', ex);
      return res.json({ code: '10012', message: '发送失败', success: false, data: ex }); 
    })
  }
}

sms.check = function(req, res, next) {
  const phone = req.body.phone || req.body.phone;
  const code = req.body.code || req.body.code;
  global.redisClient.get(phone, function(err, reply) {
    if (reply && reply.toString() && reply.toString() === code) {
      // 验证码正确
      return next();
    } else {
      return res.json({
        code: '10013',
        message: '验证码不正确',
        success: false,
        data: false,
      });
    }
  });
}