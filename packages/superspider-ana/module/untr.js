const rp = require('request-promise-native')

const conv = require('../utils/nameConv')

module.exports = async function() {
  if (!global.amdb) return
  const amdb = global.amdb

  const cursor = amdb.find({ status: 3 })
  while (await cursor.hasNext()) {
    const item = await cursor.next()
    const data = await conv(item.uname)
    console.log(`id: ${item._id} / unamejpn: ${data}`)
    try {
      await amdb.updateOne({ _id: item._id }, { $set: { unamejpn: data } })
    } catch (e) {
      console.log('ERR at id ' + item._id)
      console.log(e)
    }
  }
}
