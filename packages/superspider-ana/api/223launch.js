const Router = require('koa-router')
const launch = new Router()

const core = require('../module/core')

// /launch
launch.post('/', async (ctx, next) => {
  try {
    core()
    ctx.response.status = 200
    ctx.response.body = '223 Launched. '
    await next()
  } catch (e) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: ' + JSON.stringify(e)
    await next()
  }
})

module.exports = launch
