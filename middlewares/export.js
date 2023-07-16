/*
 * @Author: 唐文雍
 * @Date:   2019-01-16 10:17:32
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2019-01-16 10:17:32
 */
const moment = require('moment');
const fs = require('fs');
const nodeExcel = require('excel-export');
const exportFile = {};
exports.exportFile = exportFile;

// 导出Excel文件
exportFile.excel = async function (req, res, next) {
  const { exportConfig, prefix } = req.body.excelData;
  const result = nodeExcel.execute(exportConfig);
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const uploadDir = `/export/${prefix}-${timestamp}.xlsx`;
  const filePath = `./public${uploadDir}`;
  fs.writeFile(filePath, result, 'binary', function (err) {
    if (err) {
      return res.json({ code: '10001', message: err, success: false, data: null });
    }
    delete req.body.excelData;
    req.body.data = uploadDir;
    req.body.code = '10000';
    req.body.message = '操作成功';
    req.body.success = true;
    return next();
  });
};
