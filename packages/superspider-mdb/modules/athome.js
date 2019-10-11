const WebSocket = require('ws')

const keyGen = () => String(Math.random())
const parse = (string) => {
  try {
    let { key, data } = JSON.parse(string)
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (_) {}
    }
    return { key, data }
  } catch (_) {
    return undefined
  }
}

const wss = new WebSocket.Server({ port: 2165 })

const url = new URL(
  process.env.NODE_ENV == 'development'
    ? 'ws://0.0.0.0:2165'
    : 'ws://athome.bilisc.com'
)
const metadatas = ['runtime', 'platform', 'version', 'name']

// console.log('ws: 9013')

const Server = require('socket.io')
// const LRU = require('lru-cache')
const AtHome = require('athome')

// const { log, error } = require('./state')

const clusterWs = (httpHome) => {
  wss.on('connection', (ws, request) => {
    const resolveTable = new Map()
    const uuid = httpHome.join((url) => {
      // log('dispatch', { uuid })
      const key = keyGen()
      ws.send(
        JSON.stringify({
          key,
          data: {
            type: 'http',
            url
          }
        })
      )
      return new Promise((resolve) => {
        resolveTable.set(key, resolve)
      })
    })

    // console.log('online:', httpHome.homes.size)

    const { searchParams } = new URL(request.url, url)
    metadatas
      .map((key) => [key, searchParams.get(key)])
      .filter(([_k, v]) => v)
      // eslint-disable-next-line no-return-assign
      .forEach(([k, v]) => (httpHome.homes.get(uuid)[k] = v))

    // log('connect', { uuid })

    ws.on('message', (message) => {
      if (message === 'DDhttp') {
        // log('pull', { uuid })
        httpHome.pull(uuid)
      } else {
        const json = parse(message)
        if (json) {
          const { key, data } = json
          if (resolveTable.has(key)) {
            resolveTable.get(key)(data)
            resolveTable.delete(key)
          }
        }
      }
    })
    ws.on('close', (n) => {
      // log('close', { n, uuid })
      httpHome.quit(uuid)
    })
  })
}

const httpHome = new AtHome({
  validator: (result) => {
    if (!result) {
      return false
    }
    if (result.code) {
      // error(result)
      console.log('ERR when create athome')
      console.log(result)
    }
    if (result.data === undefined) {
      // error('unknow result', result)
      console.log('ERR when create athome: UN Result')
      console.log(result)
      return false
    }
    return !result.code
  }
})
// const cache = new LRU({ max: 10000, maxAge: 1000 * 60 * 4 })

clusterWs(httpHome)

// module.exports = async (url, ack) => {
//   if (typeof ack === 'function') {
//     let result = cache.get(url)
//     if (result) {
//       // log('cached', { url })
//     } else {
//       // log('executing', { url })
//       const time = Date.now()
//       result = await httpHome.execute(url).catch((e) => {
//         // error(e.message || e)
//         console.error(e.message || e)
//         return undefined
//       })
//       if (result) {
//         // log('complete', { url, time: Date.now() - time })
//         cache.set(url, result)
//       }
//     }
//     ack(result)
//   }
// }
// module.exports = async (url, ack) => {
//   if (typeof ack === 'function') {
//     try {
//       result = await httpHome.execute(url)
//       ack(result)
//     } catch (e) {
//       console.error(e.message || e)
//       return undefined
//     }
//   }
// }
module.exports = httpHome
