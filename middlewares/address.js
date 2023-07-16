/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const address = {};
exports.address = address;

//获取收货地址列表
address.list = async function(req, res, next) {
  const values = [req.body.userId];
  const filters = ['deleted=0', `user_id=?`];
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  const sql = `SELECT * FROM address ${filterString} order by is_default desc`;
  const result = await query(sql, null, values, '查询收货地址');
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

address.detail = async function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from address where deleted=0 and id=${id}`;
  const result = await query(sql, null, null, '获取收货地址详情');
  if (!result.fail && result instanceof Array) {
    req.body.data = result[0];
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: result }); 
  }
}

address.add = async function(req, res, next) {
  const userId = req.body.userId;
  const province = req.body.province;
  const city = req.body.city;
  const area = req.body.county;
  const area_code = req.body.area_code;
  const postal_code = req.body.postal_code;
  const address = req.body.addressDetail;
  const name = req.body.name;
  const tel = req.body.tel;
  const is_default = req.body.is_default === 'true' ? 1 : 0;
  const createdAt = new Date().getTime();
  const values = [userId, name, tel, province, city, area, area_code, postal_code, address, is_default, createdAt];
  const sql = `insert into address(user_id,name,tel,province,city,area,area_code,postal_code,address,is_default,created_at) values(?,?,?,?,?,?,?,?,?,?,?)`;
  const result = await query(sql, null, values, '新增收货地址');
  if (!result.fail && result instanceof Object) {
      req.body.data = result.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: result.message, success: false, data: null }); 
    }
}

address.update = async function(req, res, next) {
  const id = req.body.id;
  const province = req.body.province;
  const city = req.body.city;
  const area = req.body.county;
  const area_code = req.body.area_code;
  const postal_code = req.body.postal_code;
  const address = req.body.addressDetail;
  const name = req.body.name;
  const tel = req.body.tel;
  const is_default = req.body.is_default === 'true' ? 1 : 0;
  const updated_at = new Date().getTime();
  const values = [name, tel, province, city, area, area_code, postal_code, address, is_default, updated_at, id];
  const sql = `update address set name=?,tel=?,province=?,city=?,area=?,area_code=?,postal_code=?,address=?,is_default=?,updated_at=? where id=?;`;
  const result = await query(sql, null, values, '更新收货地址');
  if (!result.fail && result instanceof Object) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: result }); 
  }
}

address.remove = async function(req, res, next) {
  const id = req.body.id;
  const updatedAt = new Date().getTime();
  const values = [updatedAt, id]
  const sql = `update address set deleted=1,updated_at=? where id=?`;
  const result = await query(sql, null, values, '删除收货地址');
  if (!result.fail && result instanceof Object) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: result }); 
  }
}