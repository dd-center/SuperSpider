// From: https://github.com/dd-center/DDatHome-nodejs

const { URL } = require('url')
const WebSocket = require('ws')
const rp = require('request-promise-native')

const url = new URL(
  process.env.NODE_ENV == 'development'
    ? 'https://athome.bilisc.com'
    : 'http://localhost:2165'
)

const connect = () =>
  new Promise((resolve) => {
    const ws = new WebSocket(url)

    ws.on('message', async (message) => {
      try {
        const { key, options } = JSON.parse(message)
        ws.send(await rp(options))
        const now = Date.now()
        const body = await rp(options)
        ws.send(
          JSON.stringify({
            key,
            data: body
          })
        )
        setTimeout(
          () => ws.send('HANDSHAKE'),
          INTERVAL * PARALLEL - Date.now() + now
        )
      } catch (e) {
        console.log('ERR on ws msg')
        console.log(e)
      }
    })

    ws.on('open', () => {
      // console.log('DD@Home connected')
      // Array(PARALLEL)
      //   .fill()
      //   .map(() => ws.send('HANDSHAKE'))
      ws.send('HANDSHAKE')
    })

    ws.on('error', (e) => {
      console.log('ERR on ws')
      console.log(e)
    })

    ws.on('close', (n) => {
      // console.log(`closed ${n}`)
      setTimeout(resolve, 1000)
    })
  })

;(async () => {
  while (true) {
    await connect()
  }
})()
