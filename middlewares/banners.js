/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const banners = {};
exports.banners = banners;

//获取轮播图
banners.get = async function(req, res, next) {
  const client = req.body.client || '';
  const type = req.body.type || '';
  const values = [];
  const filters = ['deleted=0'];
  client && filters.push(`client like "%?%"`) && values.push(+client);
  type && filters.push(`type=?`) && values.push(type);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  const sql = `SELECT * FROM banners ${filterString} order by sort desc`;
  const result = await query(sql, null, values, '查询图片轮播');
  if (!result.fail && result instanceof Array) {
    req.body.data = result;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: '', success: false, data: 'err' }); 
  }
}
banners.add = function(req, res, next) {
  const image = req.body.image;
  const title = req.body.title;
  const type = req.body.type || 1;
  const url = req.body.url;
  const mpUrl = req.body.mpUrl;
  let client = req.body.client;
  client = client instanceof Array ? client.join(',') : client;
  const createdAt = new Date().getTime();
  const createdBy = req.body.createdBy;
  const sql = `insert into banners(type,client,image,title,url,mp_url,created_at,created_by)
               values(${type},'${client}',"${image}","${title}","${url}","${mpUrl}","${createdAt}","${createdBy}")`;
  console.info("新增轮播图", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的图片轮播`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}
banners.update = function(req, res, next) {
  const id = req.body.id;
  const image = req.body.image;
  const title = req.body.title;
  const type = req.body.type || 1;
  const url = req.body.url;
  const mpUrl = req.body.mpUrl;
  let client = req.body.client;
  client = client instanceof Array ? client.join(',') : client;
  const updated_at = new Date().getTime();
  const sql = `update banners set
               client='${client}',
               type=${type},
               image="${image}",
               title="${title}",
               url="${url}",
               mp_url="${mpUrl}",
               updated_at="${updated_at}" 
               where id=${id};`;
  console.info("更新轮播", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `更新了ID为${id}的图片轮播`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}
banners.remove = function(req, res, next) {
  const id = req.body.id || req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update banners set deleted=1,updated_at=${updatedAt} where id=${id}`;
  console.info("删除轮播图", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了ID为${id}的图片轮播`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}