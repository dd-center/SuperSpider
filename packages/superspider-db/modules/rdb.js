const fs = require('fs')
const rp = require('request-promise-native')
const schedule = require('node-schedule')

const rws = require('../utils/rws')

const events = require('events')
const emitter = new events.EventEmitter()

const schList = {}
const rList = {}
const tsList = {}

const rdbCore = async (rid) => {
  if (!rList[rid]) rList[rid] = new Array()
  if (!tsList[rid]) {
    tsList[rid] = new Date().getTime()
    await fs.promises.mkdir('/scdb/rdb2/' + rid, { recursive: true })
    await fs.promises.appendFile('/scdb/rdb2/' + rid + '/' + tsList[rid], '')
  }
  try {
    const data = JSON.parse(
      await rp({
        uri: 'https://api.live.bilibili.com/av/v1/SuperChat/getMessageList',
        qs: {
          room_id: rid
        }
      })
    )
    if (data.code !== 0) {
      console.log('ERR when rp room ' + rid + ' by code')
      return
    }
    for (const item of data.data.list) {
      if (rList[rid].includes(item.id)) continue
      await fs.promises.appendFile(
        '/scdb/rdb2/' + rid + '/' + tsList[rid],
        item.id +
          ':' +
          rid +
          ':' +
          item.ts +
          ':' +
          item.uid +
          ':' +
          item.price +
          ':' +
          item.message.replace(/\s*/g, '').replace(/[\r\n]/g, '') +
          '\n'
        // ':' +
        // data.data.message_trans
      )
      await fs.promises.appendFile(
        '/scdb/tdb/tlist',
        item.id + ':' + rid + '\n'
      )
      rList[rid].push(item.id)
    }
  } catch (e) {
    console.log('ERR when rp room ' + rid)
    // console.log(e)
  }
}

const rdbClose = async (rid) => {
  if (!schList[rid]) return
  schList[rid].cancel()
  rList[rid] = false
  tsList[rid] = false
}

module.exports = async function() {
  rws(emitter)
  emitter.on('LIVE', (data) => {
    schList[data.roomid] = schedule.scheduleJob('*/30 * * * * *', async () => {
      await rdbCore(data.roomid)
    })
  })
  emitter.on('PREPARING', async (data) => {
    await rdbClose(data.roomid)
  })
}
