const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const schedule = require('node-schedule')

const adb = require('./modules/adb')
const rdb = require('./modules/rdb')
// const trdb = require('./modules/trdb')
// const rws = require('./utils/rws')

global.adbRunning = false

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})

schedule.scheduleJob('*/5 * * * *', adb)
;(async () => {
  await adb()
  await rdb()
  // await trdb()

  app.use(bodyParser())

  // 其他页面通过 router 加载
  let api = fs.readdirSync(__dirname + '/api')
  api.forEach((element) => {
    let module = require(__dirname + '/api/' + element)
    /*
      api 下面的每个文件负责一个特定的功能，分开管理
      通过 fs.readdirSync 读取 api 目录下的所有文件名，挂载到 router 上面
    */
    router.use(
      '/' + element.replace('.js', ''),
      module.routes(),
      module.allowedMethods()
    )
  })
  app.use(router.routes())

  app.listen(2161)
})()
