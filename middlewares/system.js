/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const system = {};
exports.system = system;

// 获取系统配置
system.get = function(req, res, next) {
  const sql = "SELECT * FROM `system`";
  console.info("查询系统配置", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = Object.assign(vals[0], req.body.data);
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
// 更新系统配置
system.update = function(req, res, next) {
  const program_name = req.body.program_name;
  const show_certification = req.body.show_certification;
  const show_vip = req.body.show_vip;
  const show_publish = req.body.show_publish;
  const show_wallet = req.body.show_wallet;
  const withdraw_min = req.body.withdraw_min;
  const first_withdraw_min = req.body.first_withdraw_min;
  const withdraw_max = req.body.withdraw_max;
  const withdraw_notice = req.body.withdraw_notice;
  const is_review = req.body.is_review;
  const contact = req.body.contact;
  const h5 = req.body.h5;
  const share_title = req.body.share_title;
  const share_image = req.body.share_image;
  const commission_ratio = req.body.commission_ratio;
  const first_commission_ratio = req.body.first_commission_ratio;
  const commission_ratio_vip = req.body.commission_ratio_vip;
  const agreement_title = req.body.agreement_title;
  const agreement_content = req.body.agreement_content;
  const need_certification = req.body.need_certification;
  const publish_need_certification = req.body.publish_need_certification;
  const need_vip = req.body.need_vip;
  const vip_unlimited = req.body.vip_unlimited;
  const alipay_code = req.body.alipay_code;
  const wepay_code = req.body.wepay_code;
  const vip_description = req.body.vip_description;
  const online_pay = req.body.online_pay || 0;
  const use_apppay = req.body.use_apppay || 0;
  const use_publicpay = req.body.use_publicpay || 0;
  const use_app_alipay = req.body.use_app_alipay || 0;
  const mch_id = req.body.mch_id || '';
  const mch_key = req.body.mch_key || '';
  const task_price = req.body.task_price;
  const task_price_vip = req.body.task_price_vip;
  const invite_rule = req.body.invite_rule;
  const show_withdraw = req.body.show_withdraw;
  const show_recharge = req.body.show_recharge;
  const show_invite = req.body.show_invite;
  const show_contact = req.body.show_contact;
  const show_connect = req.body.show_connect;
  const is_ratio = req.body.is_ratio;
  const need_review = req.body.need_review;
  const show_about = req.body.show_about;
  const about_us = req.body.about_us;
  const show_recommend = req.body.show_recommend;
  const show_high = req.body.show_high;
  const show_simple = req.body.show_simple;
  const show_member = req.body.show_member;
  const base_amount = req.body.base_amount;
  const max_review_time = req.body.max_review_time;
  const open_appeal = req.body.open_appeal;
  const min_task_price = req.body.min_task_price;
  const max_task_price = req.body.max_task_price;
  const min_limit_time = req.body.min_limit_time;
  const max_limit_time = req.body.max_limit_time;
  const android_download_url = req.body.android_download_url;
  const ios_download_url = req.body.ios_download_url;
  const android_download_code = req.body.android_download_code;
  const ios_download_code = req.body.ios_download_code;
  const refresh_count = req.body.refresh_count;
  const show_refresh = req.body.show_refresh;
  const recommend_price = req.body.recommend_price;
  const vip_recommend_price = req.body.vip_recommend_price;
  const top_price = req.body.top_price;
  const vip_top_price = req.body.vip_top_price;
  const withdraw_need_certificate = req.body.withdraw_need_certificate;
  const show_certification_IDcard = req.body.show_certification_IDcard;
  const show_certification_card_number = req.body.show_certification_card_number;
  const show_register_entry = req.body.show_register_entry;
  const show_phone_login = req.body.show_phone_login;
  const vip_award_ratio = req.body.vip_award_ratio;
  const vip_award_ratio_two = req.body.vip_award_ratio_two;
  const need_bind_phone = req.body.need_bind_phone;
  const score_rate = req.body.score_rate;
  const score_for_task = req.body.score_for_task;
  const app_version = req.body.app_version;
  const app_version_name = req.body.app_version_name;
  const app_update_description = req.body.app_update_description;
  const app_update_rule = req.body.app_update_rule;
  const invite_text = req.body.invite_text;
  const invite_poster = req.body.invite_poster;
  const poster_code_width = req.body.poster_code_width;
  const poster_code_height = req.body.poster_code_height;
  const poster_code_left = req.body.poster_code_left;
  const poster_code_top = req.body.poster_code_top;
  const download_page = req.body.download_page;
  const pay_to_wechat = req.body.pay_to_wechat || 0;
  const pay_to_alipay = req.body.pay_to_alipay || 0;
  const withdraw_need_bind_wechat = req.body.withdraw_need_bind_wechat || 0;
  const policy_title = req.body.policy_title || '';
  const policy_content = req.body.policy_content || '';
  const use_phone_register = req.body.use_phone_register;
  const show_app_wechat_login = req.body.show_app_wechat_login;
  const show_find_password = req.body.show_find_password;
  const show_bind_phone = req.body.show_bind_phone || 0;
  const show_wallet_recharge = req.body.show_wallet_recharge || 0;
  const show_app_apple_login = req.body.show_app_apple_login || 0;
  const grab_btn_ad = req.body.grab_btn_ad || '';
  const withdraw_btn_ad = req.body.withdraw_btn_ad || '';
  const show_alipay_withdraw = req.body.show_alipay_withdraw || 0;
  const show_wechat_withdraw = req.body.show_wechat_withdraw || 0;
  const show_bank_withdraw = req.body.show_bank_withdraw || 0;
  const recharge_rate = req.body.recharge_rate || 100;
  const enable_location = req.body.enable_location || 0;

  const sql = `update system set 
               grab_btn_ad="${grab_btn_ad}",
               withdraw_btn_ad="${withdraw_btn_ad}",
               program_name="${program_name}",
               android_download_url="${android_download_url}",
               ios_download_url="${ios_download_url}",
               android_download_code="${android_download_code}",
               ios_download_code="${ios_download_code}",
               min_task_price=${min_task_price},
               max_task_price=${max_task_price},
               min_limit_time="${min_limit_time}",
               max_limit_time="${max_limit_time}",
               show_certification=${show_certification},
               show_vip=${show_vip},
               show_publish=${show_publish},
               show_wallet=${show_wallet},
               withdraw_min=${withdraw_min},
               first_withdraw_min=${first_withdraw_min},
               withdraw_max=${withdraw_max},
               withdraw_notice="${withdraw_notice}",
               contact="${contact}",
               h5="${h5}",
               share_title="${share_title}",
               share_image="${share_image}",
               commission_ratio=${commission_ratio},
               first_commission_ratio=${first_commission_ratio},
               commission_ratio_vip=${commission_ratio_vip},
               agreement_title="${agreement_title}",
               agreement_content="${agreement_content}",
               need_certification=${need_certification},
               publish_need_certification=${publish_need_certification},
               enable_location=${enable_location},
               need_vip=${need_vip},
               vip_unlimited=${vip_unlimited},
               alipay_code="${alipay_code}",
               wepay_code="${wepay_code}",
               vip_description="${vip_description}",
               online_pay=${online_pay},
               use_apppay=${use_apppay},
               mch_id="${mch_id}",
               mch_key="${mch_key}",
               task_price=${task_price},
               task_price_vip=${task_price_vip},
               invite_rule="${invite_rule}",
               show_withdraw=${show_withdraw},
               show_recharge=${show_recharge},
               show_invite=${show_invite},
               show_contact=${show_contact},
               show_connect=${show_connect},
               is_ratio=${is_ratio},
               need_review=${need_review},
               show_about=${show_about},
               about_us="${about_us}",
               show_recommend=${show_recommend},
               show_high=${show_high},
               show_simple=${show_simple},
               show_member=${show_member},
               base_amount=${base_amount},
               max_review_time=${max_review_time},
               open_appeal=${open_appeal},
               refresh_count=${refresh_count},
               show_refresh=${show_refresh},
               recommend_price=${recommend_price},
               vip_recommend_price=${vip_recommend_price},
               top_price=${top_price},
               vip_top_price=${vip_top_price},
               withdraw_need_certificate=${withdraw_need_certificate},
               show_certification_IDcard=${show_certification_IDcard},
               show_certification_card_number=${show_certification_card_number},
               show_register_entry=${show_register_entry},
               show_phone_login=${show_phone_login},
               use_publicpay=${use_publicpay},
               use_app_alipay=${use_app_alipay},
               vip_award_ratio=${vip_award_ratio},
               vip_award_ratio_two=${vip_award_ratio_two},
               need_bind_phone=${need_bind_phone},
               score_rate=${score_rate},
               score_for_task=${score_for_task},
               app_version=${app_version},
               app_version_name='${app_version_name}',
               app_update_description='${app_update_description}',
               app_update_rule=${app_update_rule},
               invite_text='${invite_text}',
               invite_poster='${invite_poster}',
               poster_code_width=${poster_code_width},
               poster_code_height=${poster_code_height},
               poster_code_left=${poster_code_left},
               poster_code_top=${poster_code_top},
               download_page='${download_page}',
               pay_to_wechat=${pay_to_wechat},
               pay_to_alipay=${pay_to_alipay},
               withdraw_need_bind_wechat=${withdraw_need_bind_wechat},
               policy_title='${policy_title}',
               policy_content='${policy_content}',
               use_phone_register=${use_phone_register},
               show_app_wechat_login=${show_app_wechat_login},
               show_find_password=${show_find_password},
               show_bind_phone=${show_bind_phone},
               show_wallet_recharge=${show_wallet_recharge},
               show_app_apple_login=${show_app_apple_login},
               show_alipay_withdraw=${show_alipay_withdraw},
               show_wechat_withdraw=${show_wechat_withdraw},
               show_bank_withdraw=${show_bank_withdraw},
               recharge_rate=${recharge_rate},
               is_review=${is_review}`;
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      console.info('更新系统配置返回', vals);
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `修改了系统设置`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: err }); 
    }
  })
}