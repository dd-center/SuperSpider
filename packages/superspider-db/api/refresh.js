const Router = require('koa-router')
const refresh = new Router()
const adb = require('./modules/adb')

// /refresh
refresh.get('/', async (ctx, next) => {
  ctx.response.status = 200
  ctx.response.body = 'Refresh Started. '
  await adb()
  await next()
})

module.exports = refresh
