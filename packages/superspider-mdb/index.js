const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const fs = require('fs')
// const schedule = require('node-schedule')
const bodyParser = require('koa-bodyparser')

const rdb = require('./modules/rdb')

const MongoClient = require('mongodb').MongoClient

// global.adbRunning = false
global.amdb = false
// global.rmdb = false
// global.umdb = false

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})

// schedule.scheduleJob('*/5 * * * *', adb)
;(async () => {
  // Koa Init

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

  app.listen(2166)

  // DB Init

  const client = new MongoClient(
    process.env.NODE_ENV == 'development'
      ? 'mongodb://localhost:27017/amdb'
      : 'mongodb://172.18.0.1:27017/amdb',
    { useNewUrlParser: true }
  )

  try {
    await client.connect()

    global.amdb = client.db('amdb').collection('maindb')
  } catch (err) {
    console.log('ERR when connect to AMDB')
    console.log(err)
    process.exit(1)
  }
  global.amdb.createIndex(
    {
      // _id: -1,
      roomid: -1,
      livets: -1
      // ts: -1
    },
    (e, s) => {}
  )
  global.amdb.createIndex(
    {
      _id: -1
    },
    (e, s) => {}
  )

  // await adb()
  // await rdb()
  // await trdb()
})()
