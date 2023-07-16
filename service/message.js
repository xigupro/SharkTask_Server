/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const MessageService = {};
exports.MessageService = MessageService;

// 添加客户端首页动态
MessageService.addDynamic = async function(title) {
  const created_at = Date.now();
  const sql = `insert into messages(type,user_id,title,content,business_id,created_at)
               values(8,0,'${title}','','','${created_at}')`;
  const result = await query(sql, null, null, '新增动态')
  console.info('新增动态返回', result)
}