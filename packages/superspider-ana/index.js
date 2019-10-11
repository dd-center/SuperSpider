const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const fs = require('fs')
const schedule = require('node-schedule')
const bodyParser = require('koa-bodyparser')

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const core = require('./module/core')

const MongoClient = require('mongodb').MongoClient

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})

global.amdb = false
global.utrdb = false

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

  app.listen(2163)

  // DB Init

  const client = new MongoClient(
    'mongodb://admin:' +
      process.env.MONGODB_PASS +
      '@' +
      process.env.MONGODB_IP +
      ':27017/admin?authMechanism=DEFAULT',
    { useNewUrlParser: true }
  )

  try {
    await client.connect()

    global.amdb = client.db('amdb').collection('maindb')
    global.utrdb = client.db('amdb').collection('utrdb')
  } catch (err) {
    console.log('ERR when connect to AMDB')
    console.log(err)
    process.exit(1)
  }

  schedule.scheduleJob('* * * * *', core)
})()
