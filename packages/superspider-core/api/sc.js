const Router = require('koa-router')
const sc = new Router()

// /sc
sc.get('/', async (ctx, next) => {
  ctx.response.status = 404
  ctx.response.body = 'Page Not Found'
  await next()
})

module.exports = sc
