const schedule = require('node-schedule')
const { UserService } = require('../service/user')

const scheduleCronstyle = () => {
  console.info('定时任务启动')

  schedule.scheduleJob('0 0 4 1 * *', async () => {
    console.info('每月1号凌晨4点执行定时任务:', new Date().toLocaleString())
    // 每月1号凌晨4点发放用户等级奖金
    await UserService.sendAward()
  })
}

scheduleCronstyle()
