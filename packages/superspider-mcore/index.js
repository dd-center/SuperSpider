const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const MongoClient = require('mongodb').MongoClient
global.amdb = false
global.udb = false

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})
;(async () => {
  app.use(bodyParser())
  app.use(
    cors({
      origin: (ctx) => '*',
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    })
  )

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

  app.listen(2162)

  // DB Init

  const client = new MongoClient(
    process.env.NODE_ENV == 'development'
      ? 'mongodb://localhost:27017/amdb'
      : 'mongodb://admin:' +
        process.env.MONGODB_PASS +
        '@172.18.0.1:27017/amdb?authMechanism=DEFAULT',
    { useNewUrlParser: true }
  )

  try {
    await client.connect()

    const db = client.db('amdb')
    global.amdb = db.collection('maindb')
    global.udb = db.collection('udb')

    global.udb.createIndex(
      {
        username: -1,
        password: -1
      },
      (e, s) => {}
    )
  } catch (err) {
    console.log('ERR when connect to AMDB/UDB')
    console.log(err)
    process.exit(1)
  }
})()
