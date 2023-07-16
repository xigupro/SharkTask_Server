const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { validateData, isEmptyObject } = require('./utils/function');
global.redis = require('redis');
const config = require('./config/index');
global.redisClient = redis.createClient({
    password: config.redis.password,
    host: config.redis.host,
    port: config.redis.port,
    prefix: config.redis.prefix,
});

// 定时任务
require('./schedule/index');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const bannersRouter = require('./routes/banners');
const tasksRouter = require('./routes/tasks');
const uploadRouter = require('./routes/upload');
const statisticsRouter = require('./routes/statistics');
const withdrawRouter = require('./routes/withdraw');
const administratorRouter = require('./routes/administrator');
const systemRouter = require('./routes/system');
const certificationsRouter = require('./routes/certifications');
const orderRouter = require('./routes/order');
const moneyRouter = require('./routes/money');
const entriesRouter = require('./routes/entries');
const updateRouter = require('./routes/update');
const refreshRouter = require('./routes/refresh');
const timesRouter = require('./routes/times');
const smsRouter = require('./routes/sms');
const favoriteRouter = require('./routes/favorite');
const messagesRouter = require('./routes/messages');
const signRouter = require('./routes/sign');
const scoreRouter = require('./routes/score');
const logRouter = require('./routes/log');
const helpRouter = require('./routes/help');
const goodsRouter = require('./routes/goods');
const addressRouter = require('./routes/address');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: 1024 * 1024 * 1024, extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'skey');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method.toLocaleLowerCase() === 'options'){
    res.status(204);
    return res.json({})
  }else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.method.toUpperCase() === 'POST') {
    const whiteList = [
      '/order/rechargeMoneyNotify',
      '/order/alipayRechargeNotify',
      '/order/yuwan',
      '/order/duoyou',
      '/order/xianwan'
    ];
    if (!whiteList.includes(req.url) && !isEmptyObject(req.body)) {
      if (!req.body.encryptedResult || !validateData(req.body)) {
        return res.json({ code: '10001', message: '非法请求', success: false, data: '' });
      }
    }
  }
  next();
})

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/banners', bannersRouter);
app.use('/tasks', tasksRouter);
app.use('/upload', uploadRouter);
app.use('/statistics', statisticsRouter);
app.use('/withdraw', withdrawRouter);
app.use('/administrator', administratorRouter);
app.use('/system', systemRouter);
app.use('/certifications', certificationsRouter);
app.use('/order', orderRouter);
app.use('/money', moneyRouter);
app.use('/entries', entriesRouter);
app.use('/update', updateRouter);
app.use('/refresh', refreshRouter);
app.use('/times', timesRouter);
app.use('/sms', smsRouter);
app.use('/favorite', favoriteRouter);
app.use('/messages', messagesRouter);
app.use('/sign', signRouter);
app.use('/score', scoreRouter);
app.use('/log', logRouter);
app.use('/help', helpRouter);
app.use('/goods', goodsRouter);
app.use('/address', addressRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
