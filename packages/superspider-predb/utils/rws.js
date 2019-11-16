const io = require('socket.io-client')
const socket = io('https://api.vtbs.moe')

// const events = require('events')
let dispatch = undefined
// const Server = require('socket.io')

const { LiveTCP } = require('bilibili-live-ws')
// const no = require('./env')

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const rooms = {}
const roomMid = {}

const openRoom = ({ roomid }) =>
  new Promise((resolve) => {
    // console.log(`OPEN: ${roomid}`)
    const live = new LiveTCP(roomid)
    rooms[roomid] = live
    let lastHeartbeat = 0
    const autorestart = setTimeout(() => {
      // console.log(`AUTORESTART: ${roomid}`)
      live.close()
    }, 1000 * 60 * 60 * 18)
    let timeout = setTimeout(() => {
      if (new Date().getTime() - lastHeartbeat > 1000 * 30) {
        // console.log(`TIMEOUT: ${roomid}`)
        live.close()
      }
    }, 1000 * 45)
    live.once('live', () => {
      // console.log(`READY: ${roomid}`)
    })
    live.on('LIVE', () =>
      dispatch.emit('LIVE', { roomid, mid: roomMid[roomid] })
    )
    live.on('PREPARING', () =>
      dispatch.emit('PREPARING', { roomid, mid: roomMid[roomid] })
    )
    live.on('ROUND', () =>
      dispatch.emit('ROUND', { roomid, mid: roomMid[roomid] })
    )
    live.on('heartbeat', (online) =>
      dispatch.emit('online', { roomid, mid: roomMid[roomid], online })
    )
    live.on('ROOM_CHANGE', ({ data: { title } }) =>
      dispatch.emit('title', { roomid, mid: roomMid[roomid], title })
    )
    live.on('DANMU_MSG', async ({ info }) => {
      if (!info[0][9]) {
        const message = info[1]
        const mid = info[2][0]
        const uname = info[2][1]
        dispatch.emit('danmaku', { message, roomid, mid, uname })
      }
    })
    live.on('SEND_GIFT', (payload) => {
      const coinType = payload.data.coin_type
      const mid = payload.data.uid
      const giftId = payload.data.giftId
      const totalCoin = payload.data.total_coin
      const uname = payload.data.uname
      const giftName = payload.data.gift_name
      const price = payload.data.price
      const face = payload.data.face
      dispatch.emit('gift', {
        roomid,
        mid,
        giftId,
        totalCoin,
        coinType,
        uname,
        price,
        giftName,
        face
      })
    })
    live.on('GUARD_BUY', (payload) => {
      const mid = payload.data.uid
      const uname = payload.data.username
      const num = payload.data.num
      const price = payload.data.price
      const giftId = payload.data.gift_id
      const giftName = payload.data.gift_name
      const level = payload.data.guard_level
      dispatch.emit('guard', {
        roomid,
        mid,
        uname,
        num,
        price,
        giftId,
        level,
        giftName
      })
    })

    live.on('heartbeat', () => {
      lastHeartbeat = new Date().getTime()
      timeout = setTimeout(() => {
        if (new Date().getTime() - lastHeartbeat > 1000 * 30) {
          // console.log(`TIMEOUT: ${roomid}`)
          live.close()
        }
      }, 1000 * 45)
    })
    live.on('close', () => {
      // console.log(`CLOSE: ${roomid}`)
      clearTimeout(autorestart)
      clearTimeout(timeout)
      resolve({ roomid })
    })
    live.on('error', () => {
      // console.log(`ERROR: ${roomid}`)
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
