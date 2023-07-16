/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const entries = {};
exports.entries = entries;

//获取菜单
entries.get = function(req, res, next) {
  const client = req.body.client || '';
  const type = req.body.type || '';
  let condition = client ? `and client like '%${client}%'` : '';
  condition += type ? ` and type like '%${type}%'` : '';
  const sql = `SELECT * FROM entries where deleted=0 ${condition} order by sort desc`;
  console.info("查询菜单", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
entries.add = function(req, res, next) {
  const sort = req.body.sort;
  const is_show = req.body.is_show;
  const name = req.body.name;
  const sub_name = req.body.sub_name;
  const url = req.body.url;
  const mpUrl = req.body.mpUrl;
  let client = req.body.client;
  client = client instanceof Array ? client.join(',') : client;
  let type = req.body.type;
  type = type instanceof Array ? type.join(',') : type;
  const icon = req.body.icon;
  const font_color = req.body.font_color;
  const createdAt = new Date().getTime();
  const sql = `insert into entries(type,is_show,client,icon,name,sub_name,url,mp_url,created_at,sort,font_color)
               values('${type}',${is_show},'${client}','${icon}','${name}','${sub_name}','${url}','${mpUrl}','${createdAt}',${sort},'${font_color}')`;
  console.info("新增菜单", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的菜单`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.message, success: false, data: err }); 
    }
  })
}
entries.update = async function(req, res, next) {
  const id = req.body.id;
  const sort = req.body.sort;
  const is_show = req.body.is_show;
  const name = req.body.name;
  const sub_name = req.body.sub_name;
  const url = req.body.url;
  const mpUrl = req.body.mpUrl;
  let client = req.body.client;
  client = client instanceof Array ? client.join(',') : client;
  let type = req.body.type;
  type = type instanceof Array ? type.join(',') : type;
  const icon = req.body.icon;
  const font_color = req.body.font_color;
  const updated_at = new Date().getTime();
  const sql = `update entries set
               client=?,
               icon=?,
               name=?,
               sub_name=?,
               url=?,
               mp_url=?,
               updated_at=?,
               sort=?,
               is_show=?,
               type=?,
               font_color=? 
               where id=?;`;
  const sqlValue = [client, icon, name, sub_name, url, mpUrl, updated_at, sort, is_show, type, font_color, id];
  const result = await query(sql, null, sqlValue, '更新菜单');
  if (!result.fail && result instanceof Object) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `更新了ID为${id}的菜单`,
    });
    console.info(req.body);
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: result }); 
  }
}
entries.remove = function(req, res, next) {
  const id = req.body.id || req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update entries set deleted=1,updated_at=${updatedAt} where id=${id}`;
  console.info("删除菜单", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `删除了ID为${id}的菜单`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}