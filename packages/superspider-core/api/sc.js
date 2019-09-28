const fs = require('fs')
const readline = require('readline')
const rp = require('request-promise-native')
const Router = require('koa-router')
const sc = new Router()

const parseLine = require('../utils/parseLine')

// /sc
sc.post('/', async (ctx, next) => {
  ctx.response.status = 404
  ctx.response.body = 'Page Not Found'
  await next()
})

// // /sc/uid
// sc.post('/getList', async (ctx, next) => {
//   if (!ctx.request.body.roomid) {
//     ctx.response.status = 404
//     ctx.response.body = 'Bad Request Format'
//     await next()
//     return
//   }
//   ctx.response.status = 200
//   try {
//     ctx.response.body = await fs.promises.readdir(
//       '/scdb/rdb2/' + ctx.request.body.roomid
//     )
//     await next()
//   } catch (e) {
//     ctx.response.status = 404
//     ctx.response.body = 'Data Not Found: ' + JSON.stringify(e)
//     await next()
//     return
//   }
// })

// // /sc/data
// sc.post('/getData', async (ctx, next) => {
//   if (!ctx.request.body.roomid || !ctx.request.body.ts) {
//     ctx.response.status = 404
//     ctx.response.body = 'Bad Request Format'
//     await next()
//     return
//   }
//   ctx.response.status = 200
//   try {
//     const fileStream = fs.createReadStream(
//       '/scdb/rdb2/' + ctx.request.body.roomid + '/' + ctx.request.body.ts
//     )
//     const rl = readline.createInterface({
//       input: fileStream,
//       crlfDelay: Infinity
//     })
//     const output = []
//     for await (const line of rl) {
//       const data = stringify(line)
//       if (!data) continue
//       try {
//         output.push(
//           JSON.parse(
//             await rp({
//               uri: 'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo',
//               qs: {
//                 id: data.id
//               }
//             })
//           ).data
//         )
//       } catch (e) {}
//     }
//     ctx.response.body = output
//     await next()
//   } catch (e) {
//     ctx.response.status = 404
//     ctx.response.body = 'Data Not Found: ' + JSON.stringify(e)
//     await next()
//     return
//   }
// })

// /sc/getExRate
sc.get('/getExRate', async (ctx, next) => {
  ctx.response.status = 200
  try {
    ctx.response.body = JSON.parse(
      await rp('https://api.live.bilibili.com/userext/v1/Conf/getExchangeRate')
    ).data.exchange_rate
    await next()
  } catch (e) {
    ctx.response.status = 404
    ctx.response.body = {
      code: 255,
      msg: 'Data Request Failes',
      error: e
    }
    await next()
    return
  }
})

// /sc/getFullList
sc.post('/getFullList', async (ctx, next) => {
  if (!ctx.request.body.roomid) {
    ctx.response.status = 404
    ctx.response.body = {
      code: 255,
      msg: 'Bad Request Format',
      error: 'Bad Request Format'
    }
    await next()
    return
  }
  ctx.response.status = 200
  try {
    const tsList = await fs.promises.readdir(
      '/scdb/rdb2/' + ctx.request.body.roomid
    )
    let tsSort = []
    for (const ts of tsList) {
      if (isNaN(Number(ts))) continue
      if (tsSort.includes(Number(ts))) continue
      tsSort.push(Number(ts))
    }
    tsSort = tsSort.sort((a, b) => {
      return a - b
    })
    tsSort = tsSort.slice(0, 10)
    // console.log(tsSort)
    const fullData = []
    for (const ts of tsSort) {
      const fileStream = fs.createReadStream(
        '/scdb/rdb2/' + ctx.request.body.roomid + '/' + ts
      )
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      })
      const output = []
      for await (const line of rl) {
        const data = parseLine(line)
        if (!data) continue
        try {
          const d = JSON.parse(
            await rp({
              uri: 'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo',
              qs: {
                id: data.id
              }
            })
          ).data
          if (output.findIndex((v) => v.id == d.id) < 0) output.push(d)
        } catch (e) {}
      }
      if (output.length < 1) continue
      fullData.push({
        ts,
        data: output
      })
    }
    ctx.response.body = fullData
    await next()
  } catch (e) {
    ctx.response.status = 404
    ctx.response.body = {
      code: 254,
      msg: 'Data Not Found',
      error: e
    }
    await next()
    return
  }
})

module.exports = sc
