const rp = require('request-promise-native')

const conv = require('../utils/nameConv')

module.exports = async function() {
  if (!global.amdb) return
  const amdb = global.amdb
  if (!global.utrdb) return
  const utrdb = global.utrdb

  const cursor = amdb.find({})
  while (await cursor.hasNext()) {
    const item = await cursor.next()
    if (item.unamejpn && item.unamejpn !== '') continue
    let data = ''
    const uf = await utrdb
      .find({ uname: item.uname })
      .limit(1)
      .toArray()
    if (uf.length > 0 && uf[0].unamejpn && uf[0].unamejpn !== '') {
      data = uf[0].unamejpn
      console.log('UN: ADD by UTRDB')
    } else {
      data = await conv(item.uname)
      console.log('UN: ADD by CONV')
      try {
        await utrdb.insertOne({ uname: item.uname, unamejpn: data })
      } catch (e) {
        console.log('ERR at UN insert utrdb: ' + data)
        console.log(e)
      }
    }
    console.log(`id: ${item._id} / unamejpn: ${data}`)
    try {
      await amdb.updateOne({ _id: item._id }, { $set: { unamejpn: data } })
    } catch (e) {
      console.log('ERR at id ' + item._id)
      console.log(e)
    }
  }
}
