const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const bodyParser = require('koa-bodyparser')

process.on('uncaughtException', (err) => {
  console.log('ERR unc expt')
  console.log(err)
})
;(async () => {
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

  app.listen(2162)
})()
