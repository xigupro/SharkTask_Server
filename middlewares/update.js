/*
* @Author: 唐文雍
* @Date:   2019-01-16 10:17:32
* @Last Modified by:   唐文雍
* @Last Modified time: 2019-01-16 10:17:32
*/
const query = require('../utils/pool');
const update = {};
exports.update = update;

// 更新user_tasks表中的textStep,reviewStep,reviewField字段，从对应的表拼装数据塞进去
update.userTasks = function(req, res, next) {
  const taskSql = `SELECT * FROM user_tasks`;
  query(taskSql, (taskErr, taskVals) => {
    if (!taskErr && taskVals instanceof Array) {
      taskVals.forEach((item) => {
        const textStepSql = `select * from task_text_step where task_id=${item.task_id}`;
        query(textStepSql, (textStepErr, textStepVals) => {
          if (!textStepErr && textStepVals instanceof Array) {
            textStepVals.forEach((stepItem) => {
              const updateTextStepSql = `update user_tasks set textStep='${JSON.stringify(stepItem)}' where id=${item.id}`
              query(updateTextStepSql);
            })
          }
        })

        const reviewStepSql = `select * from task_review_step where task_id=${item.task_id}`;
        query(reviewStepSql, (reviewStepErr, reviewStepVals) => {
          if (!reviewStepErr && reviewStepVals instanceof Array) {
            reviewStepVals.forEach((stepItem) => {
              const updateReviewStepSql = `update user_tasks set reviewStep='${JSON.stringify(stepItem)}' where id=${item.id}`
              query(updateReviewStepSql);
            })
          }
        })

        const reviewFieldSql = `select * from task_review_field where task_id=${item.task_id}`;
        query(reviewFieldSql, (reviewFieldErr, reviewFieldVals) => {
          if (!reviewFieldErr && reviewFieldVals instanceof Array) {
            reviewFieldVals.forEach((fieldItem) => {
              const updateReviewFieldSql = `update user_tasks set reviewField='${JSON.stringify(fieldItem)}' where id=${item.id}`
              query(updateReviewFieldSql);
            })
          }
        })
      })
      return next();
    } else {
      return res.json({ code: '10001', message: taskErr.message, success: false, data: taskErr }); 
    }
  })
}
