const fs = require('fs')
const readline = require('readline')
const rp = require('request-promise-native')
const Router = require('koa-router')
const sc = new Router()

const stringify = require('../utils/stringify')

// /sc
sc.get('/', async (ctx, next) => {
  ctx.response.status = 404
  ctx.response.body = 'Page Not Found'
  await next()
})

// /sc/uid
sc.get('/getList', async (ctx, next) => {
  if (!ctx.request.body.roomid) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Request Format'
    await next()
    return
  }
  ctx.response.status = 200
  try {
    ctx.response.body = await fs.promises.readdir(
      '/scdb/rdb2/' + ctx.request.body.roomid
    )
    await next()
  } catch (e) {
    ctx.response.status = 404
    ctx.response.body = 'Data Not Found: ' + JSON.stringify(e)
    await next()
    return
  }
})

// /sc/data
sc.get('/getData', async (ctx, next) => {
  if (!ctx.request.body.roomid || !ctx.request.body.ts) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Request Format'
    await next()
    return
  }
  ctx.response.status = 200
  try {
    const fileStream = fs.createReadStream(
      '/scdb/rdb2/' + ctx.request.body.roomid + '/' + ctx.request.body.ts
    )
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    const output = []
    for await (const line of rl) {
      const data = stringify(line)
      if (!data) continue
      try {
        output.push(
          JSON.parse(
            await rp({
              uri: 'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo',
              qs: {
                id: data.id
              }
            })
          ).data
        )
      } catch (e) {}
    }
    ctx.response.body = output
    await next()
  } catch (e) {
    ctx.response.status = 404
    ctx.response.body = 'Data Not Found: ' + JSON.stringify(e)
    await next()
    return
  }
})

module.exports = sc
