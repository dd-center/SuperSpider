// const fs = require('fs')
const rp = require('request-promise-native')
// const schedule = require('node-schedule')

const ObjectId = require('mongodb').ObjectId

const rws = require('../utils/rws')
// const athome = require('./athome')
// const LiveWS = require('bilibili-live-ws')
const nameConv = require('../utils/nameConv')
// const onLive = require('../utils/onLive')

const events = require('events')
const emitter = new events.EventEmitter()

// const schList = {}
const tsList = {}
const preList = {}

let exRate = 14.7

module.exports = async function() {
  if (!global.predb) return
  const predb = global.predb
  if (!global.utrdb) return
  const utrdb = global.utrdb
  rws(emitter)
  emitter.on('LIVE', (roomid, mid) => {
    tsList[Number(roomid)] = Number(new Date().getTime())
  })
  emitter.on('guard', async (data) => {
    const rid = Number(data.roomid)
    const uname = data.uname
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
          await utrdb.insertOne({
            uname,
            unamejpn
          })
        }
      } catch (e) {
        console.log('ERR at fetching uname ' + uname)
        console.log(e)
      }
    }
    try {
      let avatar = 'https://static.hdslb.com/images/member/noface.gif'
      try {
        const avatard = JSON.parse(
          await rp('https://api.bilibili.com/x/space/acc/info?mid=' + data.mid)
        )
        if (Number(avatard.code) == 0) avatar = avatard.data.face
        else
          console.log(
            'ERR when fetching face of uid ' + data.mid + ' by code != 0'
          )
      } catch (e) {
        console.log('ERR when fetching face of uid ' + data.mid + ' by catch')
        console.log(e)
      }
      if (preList[rid] && preList[rid].key == data.mid + '/' + data.giftName) {
        // Add Num
        if (preList[rid].id) {
          await predb.updateOne(
            {
              _id: ObjectId(preList[rid].id)
            },
            {
              $set: {
                num: Number(Number(preList[rid].num) + (Number(data.num) || 1)),
                price: Number(
                  Number(preList[rid].price) + Number(Number(data.price) / 1000)
                )
              }
            }
          )
        }
      } else {
        preList[rid] = {
          id: await predb.insertOne({
            roomid: Number(rid),
            livets: Number(tsList[rid]) || new Date().getTime(),
            ts: Number(new Date().getTime()),
            uname,
            unamejpn,
            avatar,
            price: Number(Number(data.price) / 1000),
            exrate: Number(exRate),
            hide: 0,
            type: Number(data.level),
            uid: Number(data.mid),
            num: Number(data.num) || 1,
            gift: data.giftName
          }).insertedId,
          num: Number(data.num) || 1,
          key: data.mid + '/' + data.giftName,
          price: Number(Number(data.price) / 1000)
        }
      }
    } catch (e) {
      console.log('ERR when writing data: ')
      console.log(data)
      console.log(e)
    }
  })
  emitter.on('gift', async (data) => {
    const rid = Number(data.roomid)
    if (data.coinType === 'gold') {
      const uname = data.uname
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
            await utrdb.insertOne({
              uname,
              unamejpn
            })
          }
        } catch (e) {
          console.log('ERR at fetching uname ' + uname)
          console.log(e)
        }
      }
      try {
        if (
          preList[rid] &&
          preList[rid].key == data.mid + '/' + data.giftName
        ) {
          // Add Num
          if (preList[rid].id) {
            await predb.updateOne(
              {
                _id: ObjectId(preList[rid].id)
              },
              {
                $set: {
                  num: Number(
                    Number(preList[rid].num) + (Number(data.num) || 1)
                  ),
                  price: Number(
                    Number(preList[rid].price) +
                      Number(Number(data.price) / 1000)
                  )
                }
              }
            )
          }
        } else {
          preList[rid] = {
            id: (await predb.insertOne({
              roomid: Number(rid),
              livets: Number(tsList[rid]) || Number(new Date().getTime()),
              ts: Number(new Date().getTime()),
              uname,
              unamejpn,
              avatar: data.face,
              price: Number(Number(data.price) / 1000),
              exrate: Number(exRate),
              hide: 0,
              type: 4,
              gift: data.giftName,
              uid: Number(data.mid),
              num: Number(data.num) || 1
            })).insertedId,
            num: Number(data.num) || 1,
            key: data.mid + '/' + data.giftName,
            price: Number(Number(data.price) / 1000)
          }
        }
      } catch (e) {
        console.log('ERR when writing data: ')
        console.log(data)
        console.log(e)
      }
    }
  })
}
