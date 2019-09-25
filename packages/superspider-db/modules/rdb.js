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
    await fs.promises.mkdir('/scdb/rdb/' + rid, { recursive: true })
    await fs.promises.appendFile('/scdb/rdb/' + rid + '/' + tsList[rid], '')
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
        '/scdb/rdb/' + rid + '/' + tsList[rid],
        item.id + ':' + item.uid + ':' + item.price + ':' + item.message + '\n'
        // ':' +
        // data.data.message_jpn
      )
    }
  } catch (e) {
    console.log('ERR when rp room ' + rid)
    console.log(e)
  }
}

const rdbClose = async (rid) => {
  schList[rid].cancel()
  rList[rid] = false
  tsList[rid] = false
}

module.exports = async function() {
  rws(emitter)
  emitter.on('LIVE', (rid, mid) => {
    schList[rid] = schedule.scheduleJob('*/30 * * * * *', async () => {
      await rdbCore(rid)
    })
  })
  emitter.on('PREPARING', async (rid, mid) => {
    await rdbClose(rid)
  })
}
