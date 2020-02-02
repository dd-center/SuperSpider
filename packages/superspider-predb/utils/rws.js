const io = require('socket.io-client')
const socket = io('https://api.vtbs.moe')

let dispatch = undefined

const { KeepLiveWS } = require('bilibili-live-ws')
// const no = require('./env')

const rooms = new Set()

let wssUrls = ['wss://broadcastlv.chat.bilibili.com/sub']

const refreshWssUrls = async () => {
  const {
    data: { host_server_list: hosts }
  } = JSON.parse(
    (await require('request-promise-native')
      .get('https://api.live.bilibili.com/room/v1/Danmu/getConf')
      .catch(() => ({ data: {} }))) || '{}'
  )
  if (hosts && hosts.length) {
    const urls = hosts
      .filter(({ wss_port: port }) => port === 443)
      .map(({ host }) => `wss://${host}/sub`)
    wssUrls = urls
  }
}
refreshWssUrls()
setInterval(refreshWssUrls, 1000 * 60 * 10)

const openRoom = ({ roomid, mid }) => {
  // console.log(`OPEN: ${roomid}`)
  const live = new KeepLiveWS(
    roomid,
    wssUrls[Math.floor(wssUrls.length * Math.random())]
  )
  // live.once('live', () => console.log(`LIVE: ${roomid}`))
  live.on('LIVE', () => dispatch.emit('LIVE', { roomid, mid }))
  live.on('PREPARING', () => dispatch.emit('PREPARING', { roomid, mid }))
  live.on('ROUND', () => dispatch.emit('ROUND', { roomid, mid }))
  live.on('heartbeat', (online) =>
    dispatch.emit('online', { roomid, mid, online })
  )
  live.on('ROOM_CHANGE', ({ data: { title } }) =>
    dispatch.emit('title', { roomid, mid, title })
  )
  live.on('DANMU_MSG', async ({ info }) => {
    if (!info[0][9]) {
      const message = info[1]
      const mid = info[2][0]
      const uname = info[2][1]
      const timestamp = info[0][4]
      dispatch.emit('danmaku', { message, roomid, mid, uname, timestamp })
    }
  })
  live.on('SEND_GIFT', (payload) => {
    const coinType = payload.data.coin_type
    const mid = payload.data.uid
    const giftId = payload.data.giftId
    const totalCoin = payload.data.total_coin
    const uname = payload.data.uname
    const giftName = payload.data.giftName
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
    dispatch.emit('aa', payload)
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
  live.on('close', () => {
    live.params[1] = wssUrls[Math.floor(wssUrls.length * Math.random())]
  })
  live.on('error', () => {
    // console.log(`ERROR: ${roomid}`)
  })
}

const watch = ({ roomid, mid }) => {
  if (!rooms.has(roomid)) {
    rooms.add(roomid)
    // console.log(`WATCH: ${roomid}`)
    openRoom({ roomid, mid })
  }
}

module.exports = function(emitter) {
  dispatch = emitter
  socket.on('info', (info) => {
    info
      .filter(({ roomid }) => roomid)
      // .filter(({ roomid }) => !no.includes(roomid))
      .forEach(({ roomid, mid }) => watch({ roomid, mid }))
    // console.log('REFRESH')
  })
}
