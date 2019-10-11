const rp = require('request-promise-native')

const conv = require('../utils/nameConv')

const log = process.env.NODE_ENV == 'development' ? console.log : () => {}

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
      log('UN: ADD by UTRDB')
    } else {
      data = await conv(item.uname)
      log('UN: ADD by CONV')
      try {
        await utrdb.insertOne({ uname: item.uname, unamejpn: data })
      } catch (e) {
        log('ERR at UN insert utrdb: ' + data)
        log(e)
      }
    }
    log(`id: ${item._id} / unamejpn: ${data}`)
    try {
      await amdb.updateOne({ _id: item._id }, { $set: { unamejpn: data } })
    } catch (e) {
      log('ERR at id ' + item._id)
      log(e)
    }
  }
}
