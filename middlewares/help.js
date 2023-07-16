/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const help = {};
exports.help = help;

// 帮助文章列表
help.list = async function(req, res, next) {
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
  const { type, title } = param;
  const filters = ['a.deleted=0'];
  title && filters.push(`a.title like "%${title}%"`);
  type && filters.push(`a.type=${type}`);
  const filterString = filters.length ? `where ${filters.join(' and ')}` : '';
  var sql = `SELECT count(*) FROM help_articles a ${filterString};
             SELECT a.id,a.title,a.type,t.name as type_name,a.created_at,a.updated_at FROM help_articles a 
             left join help_type t on t.id=a.type ${filterString}
             order by a.created_at desc limit ? offset ?`;
  const queryResult = await query(sql, null, [size, offset], '查询帮助文章列表');
  if (!queryResult.fail && queryResult instanceof Array) {
    const totalCount = queryResult[0][0]['count(*)'];
    const totalPage = Math.ceil(parseInt(totalCount) / size);
    req.body.data = {
      list: queryResult[1],
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
    return res.json({ code: '10001', message: queryResult.message, success: false, data: null});
  }
}

// 帮助文章详情
help.detail = async function(req, res, next) {
  const id = req.body.id;
  const sql = `select * from help_articles where id=${id}`;
  console.info('活动详情', sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals[0];
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

// 添加帮助文章
help.add = async function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  const type = req.body.type;
  const createdAt = new Date().getTime();
  const sql = `insert into help_articles(type,title,content,created_at)
               values(?,?,?,?)`;
  const result = await query(sql, null, [type, title, content, createdAt], '新增帮助文章');
  if (!result.fail && result instanceof Object) {
    req.body.data = result.insertId;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `添加了ID为${result.insertId}的帮助文章`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 更新帮助文章
help.update = async function(req, res, next) {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const type = req.body.type;
  const updated_at = new Date().getTime();
  const sql = `update help_articles set type=?,title=?,content=?,updated_at=? where id=?;`;
  const result = await query(sql, null, [type, title, content, updated_at, id], '更新帮助文章');
  if (!result.fail && result.affectedRows) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `更新了ID为${id}的帮助文章`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 删除帮助文章
help.remove = async function(req, res, next) {
  const id = req.body.id;
  const updated_at = new Date().getTime();
  const sql = `update help_articles set deleted=1,updated_at=? where id=?`;
  const result = await query(sql, null, [updated_at, id], '删除帮助文章');
  if (!result.fail && result.affectedRows) {
    req.body.data = true;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    // 记录操作日志
    req.body.log = Object.assign(req.body.log || {}, {
      client: 1,
      content: `删除了ID为${id}的帮助文章`,
    });
    return next();
  } else {
    return res.json({ code: '10001', message: result.message, success: false, data: null }); 
  }
}

// 分类列表
help.typeList = async function(req, res, next) {
  const sql = `SELECT * FROM help_type order by created_at desc`;
  const result = await query(sql, null, null, '查询帮助文章分类');
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

// 删除分类
help.removeType = function(req, res, next) {
  const id = req.body.id;
  // 先查找是否有帮助文章在使用此分类
  const checkSql = `select count(*) from help_articles where type=${id} and deleted=0`;
  const sql = `delete from help_type where id=${id}`;
  console.info('删除帮助文章分类', sql);
  query(checkSql, (helpErr, helpVals) => {
    console.info('查询分类下的帮助文章数返回', helpVals);
    if (!helpErr && helpVals instanceof Array) {
      if (helpVals[0]['count(*)'] > 0) {
        return res.json({ code: '10001', message: '删除失败，有帮助文章在使用此分类', success: false, data: null });
      } else {
        query(sql, (err, vals) => {
          console.info('删除帮助文章分类返回', vals);
          if (!err && vals instanceof Object) {
            req.body.data = vals;
            req.body.code = '10000';
            req.body.message = '操作成功';
            req.body.success = true;
            // 记录操作日志
            req.body.log = Object.assign(req.body.log || {}, {
              client: 1,
              content: `删除了ID为${id}的帮助文章分类`,
            });
            return next();
          } else {
            return res.json({ code: '10001', message: err.code, success: false, data: null }); 
          }
        });
      }
    }
  });
  
}

// 添加分类
help.addType = function(req, res, next) {
  const name = req.body.name;
  const created_at = new Date().getTime();
  const sql = `insert into help_type(name, created_at) values("${name}","${created_at}")`;
  console.info('添加分类', sql);
  query(sql, (err, vals) => {
    console.info('添加分类返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `添加了ID为${vals.insertId}的帮助文章分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}

// 更新分类
help.updateType = function(req, res, next) {
  const id = req.body.id;
  const name = req.body.name;
  const updated_at = new Date().getTime();
  const sql = `update help_type set name="${name}",updated_at="${updated_at}" where id=${id}`;
  console.info('更新帮助文章分类', sql);
  query(sql, (err, vals) => {
    console.info('更新帮助文章分类返回', vals, err);
    if (!err && vals instanceof Object) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      // 记录操作日志
      req.body.log = Object.assign(req.body.log || {}, {
        client: 1,
        content: `更新了ID为${id}的帮助文章分类`,
      });
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  });
}