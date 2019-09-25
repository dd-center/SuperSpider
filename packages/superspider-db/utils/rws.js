const io = require('socket.io-client')
const socket = io('http://0.0.0.0:8001')

// const events = require('events')
const dispatch = undefined

const LiveWS = require('bilibili-live-ws')
// const no = require('./env')

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let rooms = {}
let roomMid = {}

const openRoom = ({ roomid }) =>
  new Promise((resolve) => {
    // console.log(`OPEN: ${roomid}`)
    let ws = new LiveWS(roomid)
    rooms[roomid] = ws
    let lastHeartbeat = 0
    let autorestart = setTimeout(() => {
      // console.log(`AUTORESTART: ${roomid}`)
      ws.close()
      resolve({ roomid })
    }, 1000 * 60 * 60 * 18)
    let timeout = setTimeout(() => {
      if (new Date().getTime() - lastHeartbeat > 1000 * 30) {
        // console.log(`TIMEOUT: ${roomid}`)
        ws.close()
        clearTimeout(autorestart)
        clearTimeout(timeout)
        resolve({ roomid })
      }
    }, 1000 * 45)
    ws.once('live', () => {
      // console.log(`READY: ${roomid}`)
    })
    ws.on('LIVE', () => dispatch.emit('LIVE', { roomid, mid: roomMid[roomid] }))
    ws.on('PREPARING', () =>
      dispatch.emit('PREPARING', { roomid, mid: roomMid[roomid] })
    )
    ws.on('ROUND', () =>
      dispatch.emit('ROUND', { roomid, mid: roomMid[roomid] })
    )
    ws.on('heartbeat', (online) =>
      dispatch.emit('online', { roomid, mid: roomMid[roomid], online })
    )
    ws.on('ROOM_CHANGE', ({ data: { title } }) =>
      dispatch.emit('title', { roomid, mid: roomMid[roomid], title })
    )
    ws.on('DANMU_MSG', async ({ info }) => {
      if (!info[0][9]) {
        let message = info[1]
        let mid = info[2][0]
        let uname = info[2][1]
        dispatch.emit('danmaku', { message, roomid, mid, uname })
      }
    })
    ws.on('SEND_GIFT', (payload) => {
      let coinType = payload.data.coin_type
      let mid = payload.data.uid
      let giftId = payload.data.giftId
      let totalCoin = payload.data.total_coin
      let uname = payload.data.uname
      dispatch.emit('gift', { roomid, mid, giftId, totalCoin, coinType, uname })
    })
    ws.on('GUARD_BUY', (payload) => {
      let mid = payload.data.uid
      let uname = payload.data.username
      let num = payload.data.num
      let price = payload.data.price
      let giftId = payload.data.gift_id
      let level = payload.data.guard_level
      dispatch.emit('guard', { roomid, mid, uname, num, price, giftId, level })
    })

    ws.on('heartbeat', () => {
      lastHeartbeat = new Date().getTime()
      timeout = setTimeout(() => {
        if (new Date().getTime() - lastHeartbeat > 1000 * 30) {
          // console.log(`TIMEOUT: ${roomid}`)
          ws.close()
          clearTimeout(autorestart)
          clearTimeout(timeout)
          resolve({ roomid })
        }
      }, 1000 * 45)
    })
    ws.on('close', () => {
      // console.log(`CLOSE: ${roomid}`)
      clearTimeout(autorestart)
      clearTimeout(timeout)
      resolve({ roomid })
    })
    ws.on('error', () => {
      // console.log(`ERROR: ${roomid}`)
      ws.close()
      clearTimeout(autorestart)
      clearTimeout(timeout)
      resolve({ roomid })
    })
  })

const watch = async (roomid) => {
  let object = { roomid }
  for (;;) {
    object = await openRoom(object)
    await wait(250)
    // console.log(`REOPEN: ${roomid}`)
  }
}

module.exports = function(emitter) {
  dispatch = emitter
  socket.on('info', async (info) => {
    info
      .filter(({ roomid }) => roomid)
      // .filter(({ roomid }) => !no.includes(roomid))
      .forEach(async ({ roomid, mid }) => {
        roomMid[roomid] = mid
        if (!rooms[roomid]) {
          rooms[roomid] = true
          watch(roomid)
        }
      })
    // console.log('REFRESH')
  })
}
