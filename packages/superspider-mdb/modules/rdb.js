// const fs = require('fs')
const rp = require('request-promise-native')
const schedule = require('node-schedule')

const rws = require('../utils/rws')
const athome = require('./athome')
const nameConv = require('../utils/nameConv')
const onLive = require('../utils/onLive')

const events = require('events')
const emitter = new events.EventEmitter()

const schList = {}
const tsList = {}

let exRate = 14.7

const rdbCore = async (rid) => {
  if (!global.amdb) return
  const amdb = global.amdb
  if (!global.utrdb) return
  const utrdb = global.utrdb
  if (!tsList[rid]) {
    tsList[rid] = new Date().getTime()
  }
  try {
    let data = false
    if (global.usingAtHome)
      data = JSON.parse(
        await athome.execute(
          'https://api.live.bilibili.com/av/v1/SuperChat/getMessageList?room_id=' +
            rid
        )
      )
    else
      data = JSON.parse(
        await rp(
          'https://api.live.bilibili.com/av/v1/SuperChat/getMessageList?room_id=' +
            rid
        )
      )
    if (data.code !== 0) {
      console.log('ERR when rp room ' + rid + ' by code')
      return
    }
    for (const item of data.data.list) {
      const uname = item.user_info.uname
      let unamejpn = ''
      const unameFinded = await utrdb
        .find({ uname })
        .limit(1)
        .toArray()
      if (
        unameFinded.length > 0 &&
        unameFinded[0].unamejpn &&
        unameFinded[0].unamejpn !== ''
      ) {
        unamejpn = unameFinded[0].unamejpn
      } else {
        try {
          unamejpn = await nameConv(uname)
          if (unameFinded.length > 0) {
            await utrdb.updateOne({ uname }, { $set: { unamejpn } })
          } else {
            await utrdb.insertOne({ uname, unamejpn })
          }
        } catch (e) {
          console.log('ERR at fetching uname ' + uname)
          console.log(e)
        }
      }
      const hasTr =
        item.message_jpn.replace(/\s*/g, '').replace(/[\r\n]/g, '') !== ''
      try {
        if (hasTr) {
          const result = await amdb
            .find({ _id: Number(item.id) })
            .limit(1)
            .toArray()
          if (result.length !== 0) {
            if (Number(result[0].status) > 2) continue
            // Replace 3
            await amdb.updateOne(
              { _id: Number(item.id) },
              {
                $set: {
                  status: 3,
                  msgjpn: item.message_jpn
                    .replace(/\s*/g, '')
                    .replace(/[\r\n]/g, '')
                }
              }
            )
          } else {
            // Insert 3
            await amdb.insertOne({
              _id: Number(item.id),
              status: 3,
              roomid: Number(rid),
              livets: Number(tsList[rid]),
              ts: Number(item.start_time),
              uname: item.user_info.uname,
              unamejpn,
              avatar: item.user_info.face,
              price: Number(item.price),
              msg: item.message.replace(/\s*/g, '').replace(/[\r\n]/g, ''),
              msgjpn: item.message_jpn
                .replace(/\s*/g, '')
                .replace(/[\r\n]/g, ''),
              msgtr: '',
              trstatus: 0,
              tr: 0,
              bcolor: item.background_bottom_color,
              pcolor: item.background_price_color,
              exrate: Number(exRate),
              hide: 0
            })
          }
        } else {
          const result = await amdb
            .find({ _id: Number(item.id) })
            .limit(1)
            .toArray()
          if (result.length !== 0) {
            // Replace 2
            await amdb.updateOne(
              { _id: Number(item.id) },
              {
                $set: {
                  // _id: Number(item.id),
                  status: 2,
                  roomid: Number(rid),
                  livets: Number(tsList[rid]),
                  ts: Number(item.start_time),
                  uname: item.user_info.uname,
                  unamejpn,
                  avatar: item.user_info.face,
                  price: Number(item.price),
                  msg: item.message.replace(/\s*/g, '').replace(/[\r\n]/g, ''),
                  msgjpn: item.message_jpn
                    .replace(/\s*/g, '')
                    .replace(/[\r\n]/g, ''),
                  msgtr: '',
                  trstatus: 0,
                  tr: 0,
                  bcolor: item.background_bottom_color,
                  pcolor: item.background_price_color,
                  exrate: Number(exRate),
                  hide: 0
                }
              }
            )
          } else {
            // Insert 2
            await amdb.insertOne({
              _id: Number(item.id),
              status: 2,
              roomid: Number(rid),
              livets: Number(tsList[rid]),
              ts: Number(item.start_time),
              uname: item.user_info.uname,
              unamejpn,
              avatar: item.user_info.face,
              price: Number(item.price),
              msg: item.message.replace(/\s*/g, '').replace(/[\r\n]/g, ''),
              msgjpn: item.message_jpn
                .replace(/\s*/g, '')
                .replace(/[\r\n]/g, ''),
              msgtr: '',
              trstatus: 0,
              tr: 0,
              bcolor: item.background_bottom_color,
              pcolor: item.background_price_color,
              exrate: Number(exRate),
              hide: 0
            })
          }
        }
      } catch (e) {
        console.log('ERR when writing data: ')
        console.log(data)
        console.log(e)
      }
    }
  } catch (e) {
    console.log('ERR when rp room ' + rid)
    // console.log(e)
  }
}

const rdbClose = async (rid) => {
  if (!schList[rid]) return
  schList[rid].cancel()
  tsList[rid] = false
}

module.exports = async function() {
  rws(emitter)
  try {
    for (const item of await onLive()) {
      schList[Number(item)] = schedule.scheduleJob(
        '*/40 * * * * *',
        async () => {
          await rdbCore(Number(item))
        }
      )
    }
  } catch (e) {
    console.log('ERR when fetch onLive')
    console.log(e)
  }
  exRate = Number(
    JSON.parse(
      await rp('https://api.live.bilibili.com/userext/v1/Conf/getExchangeRate')
    ).data.exchange_rate
  )
  emitter.on('LIVE', (data) => {
    schList[Number(data.roomid)] = schedule.scheduleJob(
      '*/40 * * * * *',
      async () => {
        await rdbCore(Number(data.roomid))
      }
    )
  })
  emitter.on('PREPARING', async (data) => {
    await rdbClose(Number(data.roomid))
  })
}
