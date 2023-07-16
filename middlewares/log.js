/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const query = require('../utils/pool');
const log = {};
exports.log = log;

//后台管理》分页获取操作日志列表
log.list = async function(req, res, next) {
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
  const { content, user, createDateRange } = param;
  const filters = [];
  content && filters.push(`content like "%${content}%"`);
  user && filters.push(`user='${user}'`);
  createDateRange && createDateRange.length === 2 && filters.push(`created_at >= ${createDateRange[0]} and created_at <= ${createDateRange[1]}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  var sql = `SELECT count(*) FROM logs ${filterString};
            select * FROM logs ${filterString} order by created_at desc limit ${size} offset ${offset}`;
  console.info('查询操作日志', sql);;
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
};

// 添加操作日志
log.add = async function(req, res, next) {
  if (!req.body.log) {
    return next();
  }
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  const { user, client, content } = req.body.log;
  if (!user || !client || !content) {
    return next();
  }
  const created_at = new Date().getTime();
  const sql = `insert into logs(user,client,ip,content,created_at) values(?,?,?,?,?)`;
  await query(sql, null, [user, client, ip, content, created_at], '添加操作日志');
  // 清空日志
  delete req.body.log;
  return next();
}