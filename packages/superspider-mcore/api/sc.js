const fs = require('fs')
const readline = require('readline')
const rp = require('request-promise-native')
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
  if (!ctx.request.body.roomid || isNaN(Number(ctx.request.body.roomid))) {
    ctx.response.status = 404
    ctx.response.body = 'Bad Reuest Format'
    await next()
  } else {
    try {
      ctx.response.status = 200
      ctx.response.body = [
        {
          ts: '15000000000',
          data: [
            {
              _id: 1,
              status: 4,
              roomid: 1,
              livets: 10000,
              ts: 100000000,
              uname: '用户名1',
              avatar: 'https://static.hdslb.com/images/member/noface.gif',
              price: 30,
              msg: '可爱！',
              msgjpn: '可爱可爱可爱',
              msgtr: '可愛い',
              trstatus: 1,
              tr: 1,
              bcolor: '#AAAAAA',
              pcolor: '#BBBBBB',
              exrate: '14.7',
              hide: 0
            },
            {
              _id: 2,
              status: 4,
              roomid: 1,
              livets: 10000,
              ts: 100000002,
              uname: '用户名2',
              avatar: 'https://static.hdslb.com/images/member/noface.gif',
              price: 30,
              msg: '可爱！',
              msgjpn: '可爱可爱可爱',
              msgtr: '',
              trstatus: 1,
              tr: 1,
              bcolor: '#AAAAAA',
              pcolor: '#BBBBBB',
              exrate: '14.7',
              hide: 0
            },
            {
              _id: 3,
              status: 4,
              roomid: 1,
              livets: 10000,
              ts: 100000004,
              uname: '用户名3',
              avatar: 'https://static.hdslb.com/images/member/noface.gif',
              price: 30,
              msg: '可爱！',
              msgjpn: '',
              msgtr: '',
              trstatus: 1,
              tr: 1,
              bcolor: '#AAAAAA',
              pcolor: '#BBBBBB',
              exrate: '14.7',
              hide: 0
            }
          ]
        }
      ]
      await next()
    } catch (e) {
      ctx.response.status = 500
      ctx.response.body = 'Internal Server Error'
      await next()
      console.log(e)
    }
  }
})

module.exports = sc
