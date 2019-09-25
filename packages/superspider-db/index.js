const schedule = require('node-schedule')

const adb = require('./modules/adb')
const rdb = require('./modules/rdb')
// const rws = require('./utils/rws')

global.adbRunning = false

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})

schedule.scheduleJob('*/10 * * * *', adb)
;(async () => {
  await adb()
  await rdb()
})()
