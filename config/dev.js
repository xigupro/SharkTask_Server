module.exports = {
  wechat: {
    appId: '',
    appSecret: '',
    mchId: '',
    mchAppId: '',
    mchKey: '',
    officialAccount: {
      appId: '',
      appSecret: '',
    },
    open: {
      appId: '',
      appSecret: '',
    }
  },
  image: 'https://img.xigu.pro',
  domain: 'https://shark-api.xigu.pro',
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'TAMMENY',
    database: 'task_paradise',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
    prefix: 'xigu:',
  },
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
  },
  aliyun: {
    accessKey: '',
    secretKey: '',
    sms: {
      signName: "鲨鱼任务",
      templateCode: "SMS_189763152",
    },
  },
  alipay: {
    appId: '2021001146644054',
  },
  xianwan: {
    '5395': 'lf6ycxkk9p4vajxe', // 安卓
    '5526': 'tuhuwh4340rkirsn', // iOS
  },
  yuwan: {
    appId: '1540',
    appSecret: '25jdovqsq0khowsmo5nir0mx9m30gk41',
  },
  duoyou: {
    'dy_59634076': '9ef2f1dd1c913d9057eb5b544b4512ef',  // 安卓
    'dy_59634077': '4745bef81ca46a035ac0998505f7f6f0',  // iOS
  }
};
