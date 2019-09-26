const Router = require('koa-router')
const adb = new Router()
const adbGo = require('../modules/adb')

// /adb
adb.get('/', async (ctx, next) => {
  ctx.response.status = 200
  ctx.response.body = 'adb Started. '
  adbGo()
  await next()
})

module.exports = adb
