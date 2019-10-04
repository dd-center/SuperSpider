const Router = require('koa-router')
const launch = new Router()

const untr = require('../module/untr')

// /launch
launch.get('/', async (ctx, next) => {
  try {
    untr()
    ctx.response.status = 200
    ctx.response.body = 'UN Launched. '
    await next()
  } catch (e) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: ' + JSON.stringify(e)
    await next()
  }
})

module.exports = launch
