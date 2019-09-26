const Router = require('koa-router')
const trdb = new Router()
const trdbGo = require('./modules/trdb')

// /trdb
trdb.get('/', async (ctx, next) => {
  ctx.response.status = 200
  ctx.response.body = 'TRDB Started. '
  await trdbGo()
  await next()
})

module.exports = trdb
