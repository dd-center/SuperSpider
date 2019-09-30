// const fs = require('fs')
// const readline = require('readline')
// const rp = require('request-promise-native')
const Router = require('koa-router')
const sc = new Router()

// /sc
sc.post('/', async (ctx, next) => {
  ctx.response.status = 404
  ctx.response.body = 'Page Not Found'
  await next()
})

// /sc/getData
sc.post('/getData', async (ctx, next) => {
  if (!global.amdb) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: AMDB ERR'
    await next()
    return
  }
  const amdb = global.amdb
  if (!ctx.request.body.roomid || isNaN(Number(ctx.request.body.roomid))) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Request Format'
    await next()
  } else {
    try {
      ctx.response.status = 200
      const roomid = Number(ctx.request.body.roomid)
      const finded = await amdb
        .find({ roomid })
        .limit(50)
        .toArray()
      const tsList = new Array()
      const rList = []
      for (const item of finded) {
        if (!item.livets) continue
        if (Number(item.hide) > 0) continue
        const livets = Number(item.livets)
        if (!tsList.includes(livets)) tsList.push(livets)
        if (!rList[livets]) rList[livets] = new Array()
        rList[livets].push(item)
      }
      const output = []
      for (const ts of tsList) {
        output.push({
          ts,
          data: rList[ts]
        })
      }
      ctx.response.body = output
      await next()
    } catch (e) {
      ctx.response.status = 500
      ctx.response.body = 'Internal Server Error'
      await next()
      console.log(e)
    }
  }
})

// /sc/submit
sc.post('/submit', async (ctx, next) => {
  if (!global.amdb) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: AMDB ERR'
    await next()
    return
  }
  if (!global.udb) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: UDB ERR'
    await next()
    return
  }
  const amdb = global.amdb
  const udb = global.udb
  if (
    !ctx.request.body.username ||
    !ctx.request.body.password ||
    !ctx.request.body.id ||
    !ctx.request.body.tr
  ) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Request Format'
    await next()
    return
  }
  try {
    const u = await udb
      .find({
        username: ctx.request.body.username,
        password: ctx.request.body.password
      })
      .limit(1)
      .toArray()
    if (u.length < 1) {
      ctx.response.status = 403
      ctx.response.body = 'Forbidden'
      await next()
      return
    }
    const ust = u[0].trstatus
    const item = await amdb
      .find({ _id: Number(ctx.request.body.id) })
      .limit(1)
      .toArray()
    if (item.trstatus > ust) {
      ctx.response.status = 200
      ctx.response.body = 1
      await next()
      return
    }
    await amdb.updateOne(
      { _id: Number(ctx.request.body.id) },
      { $set: { msgtr: ctx.request.body.tr } }
    )
    ctx.response.status = 200
    ctx.response.body = 0
    await next()
  } catch (e) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error'
    await next()
    console.log(e)
  }
})

// /sc/hide
sc.post('/hide', async (ctx, next) => {
  if (!global.amdb) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: AMDB ERR'
    await next()
    return
  }
  if (!global.udb) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error: UDB ERR'
    await next()
    return
  }
  const amdb = global.amdb
  const udb = global.udb
  if (
    !ctx.request.body.username ||
    !ctx.request.body.password ||
    !ctx.request.body.id
  ) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Request Format'
    await next()
    return
  }
  try {
    const u = await udb
      .find({
        username: ctx.request.body.username,
        password: ctx.request.body.password
      })
      .limit(1)
      .toArray()
    if (u.length < 1) {
      ctx.response.status = 403
      ctx.response.body = 'Forbidden'
      await next()
      return
    }
    const ust = u[0].trstatus
    const item = await amdb
      .find({ _id: Number(ctx.request.body.id) })
      .limit(1)
      .toArray()
    if (item.trstatus > ust) {
      ctx.response.status = 200
      ctx.response.body = 1
      await next()
      return
    }
    await amdb.updateOne(
      { _id: Number(ctx.request.body.id) },
      { $set: { hide: 1 } }
    )
    ctx.response.status = 200
    ctx.response.body = 0
    await next()
  } catch (e) {
    ctx.response.status = 500
    ctx.response.body = 'Internal Server Error'
    await next()
    console.log(e)
  }
})

module.exports = sc
