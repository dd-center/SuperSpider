const rp = require('request-promise-native')

module.exports = async function() {
  if (!global.amdb) return
  const amdb = global.amdb

  const cursor = amdb.find({ status: 2 })
  while (await cursor.hasNext()) {
    const item = await cursor.next()
    const data = JSON.parse(
      await rp(
        'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo?id=' +
          item._id
      )
    ).data
    console.log('TR: ')
    console.log(`id: ${item._id} / jpn: ${data.message_jpn}`)
    try {
      await amdb.updateOne(
        { _id: item._id },
        { $set: { msgjpn: data.message_jpn, status: 3 } }
      )
    } catch (e) {
      console.log('ERR at id ' + item._id)
      console.log(e)
    }
  }
}
