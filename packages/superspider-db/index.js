const schedule = require('node-schedule')

const adb = require('./modules/adb')

global.adbRunning = false

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})

schedule.scheduleJob('*/10 * * * *', adb)
;(async () => {
  await adb()
})()
