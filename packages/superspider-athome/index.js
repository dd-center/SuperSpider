// From: https://github.com/dd-center/DDatHome-nodejs

const { URL } = require('url') // Compatibility
const WebSocket = require('ws')
const rp = require('request-promise-native')

const parse = (string) => {
  try {
    const json = JSON.parse(string)
    if (json) {
      const {
        key,
        data: { type, url }
      } = json
      if (type === 'http') {
        return { key, url }
      }
    }
  } catch (_) {
    return undefined
  }
}

const url = new URL(
  process.env.url || process.env.development
    ? 'ws://0.0.0.0:2165'
    : 'wss://athome.bilisc.com'
)

const VERSION = '0.1.0'

const PARALLEL = 8
const INTERVAL = Number.isNaN(Number(process.env.interval))
  ? 480
  : Number(process.env.interval)

if (!process.env.hide) {
  url.searchParams.set('runtime', `node${process.version}`)
  url.searchParams.set('version', VERSION)
  url.searchParams.set('platform', process.platform)
  if (process.env.docker) {
    url.searchParams.set('docker', 'docker')
  }
}

if (process.env.nickname) {
  url.searchParams.set('name', process.env.nickname)
}

const verbose = process.env.development || process.env.verbose
const log = verbose ? console.log : () => {}

if (verbose) {
  console.log('verbose log is on')
} else {
  console.log('verbose log is off')
}

if (process.env.development) {
  console.log('Development Environment Detected')
}

console.log({
  INTERVAL
})

console.log(`using: ${url}`)

const connect = () =>
  new Promise((resolve) => {
    const ws = new WebSocket(url)

    ws.on('message', async (message) => {
      const json = parse(message)
      if (json) {
        const now = Date.now()
        const { key, url } = json
        log('job received', url)
        const time = Date.now()
        const body = await rp(url)
        log(`job complete ${((Date.now() - time) / 1000).toFixed(2)}s`)
        ws.send(
          JSON.stringify({
            key,
            data: body
          })
        )
        setTimeout(
          () => ws.send('DDhttp'),
          INTERVAL * PARALLEL - Date.now() + now
        )
      }
    })

    ws.on('open', () => {
      // console.log('DD@Home connected')
      Array(PARALLEL)
        .fill()
        .map(() => ws.send('DDhttp'))
    })

    ws.on('error', (e) => {
      console.error(`error: ${e.message}`)
    })

    ws.on('close', (n) => {
      console.log(`closed ${n}`)
      setTimeout(resolve, 1000)
    })
  })

;(async () => {
  while (true) {
    await connect()
  }
})()
