const crypto = require('crypto');
const qs = require('qs');
const config = require('../config/index');

module.exports = {
  /**
   * randomWord 产生任意长度随机字母数字组合
   * @param randomFlag 是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
   * @param min
   * @param max
   * @returns {string}
   */
  randomWord: function(randomFlag, min, max) {
    var str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
  },
  /**
   * 加密数据
   * @param {String} data 待加密的数据
   */
  encryptSha1: function(data) {
    return crypto.createHash('sha1').update(data, 'utf8').digest('hex');
  },

  // 过滤掉单双引号
  replaceIllegalString: function(data) {
    if (!data) {
      return '';
    }
    if (typeof data !== 'string') {
      return data;
    }
    return data.replace(/("|')/g, '”');
  },

  // 校验md5
  validateData: function(data) {
    if (!data) {
      return '';
    }
    const encryptedResult = data.encryptedResult;
    delete data.encryptedResult;
    const result = crypto.createHash('md5').update(`${qs.stringify(data)}1ef072259c8d1b925c08a7639cab6367_shark_task_2019`, 'utf8').digest('hex');
    return result === encryptedResult;
  },
  // 是否为空对象
  isEmptyObject: function(obj){  
    for(var key in obj){
      return false
    };
    return true;
  },
  // 转义字符串，包含-_.!~*'()
  fixedEncodeURIComponent: function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  },
  // 获取七牛云链接
  getQiniuFullUrl: function(val) {
    if (!val || val === 'undefined') {
      return '';
    }
    if (/^(http|https):\/\/.+/.test(val)) {
      return val;
    }
    return `${config.image}/${val}`;
  }
}