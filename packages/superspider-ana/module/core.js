const rp = require('request-promise-native')
const fs = require('fs')

const { amdbP } = require('../utils/db')

const log = process.env.NODE_ENV == 'development' ? console.log : () => {}

module.exports = async function() {
  const amdb = await amdbP

  const lim = await fs.promises.readFile('/scdb/trlimit')

  const cursor = amdb.find({ msgjpn: '' })
  while (await cursor.hasNext()) {
    const item = await cursor.next()
    if (Number(item._id) < Number(lim)) continue
    const data = JSON.parse(
      await rp(
        'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo?id=' +
          item._id
      )
    ).data
    log('TR: ')
    log(`id: ${item._id} / jpn: ${data.message_jpn}`)
    try {
      await amdb.updateOne(
        { _id: item._id },
        { $set: { msgjpn: data.message_jpn, status: data !== '' ? 3 : 2 } }
      )
    } catch (e) {
      log('ERR at id ' + item._id)
      log(e)
    }
  }
}
