// const { once } = require('events')
const fs = require('fs')
const readline = require('readline')

module.exports = async function() {
  console.log('TRDB STARTED')
  if (!global.amdb) return
  const amdb = global.amdb
  const fileStream = fs.createReadStream('/scdb/tdb/tlist')
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (const line of rl) {
    try {
      if (line.split(':').length < 1) continue
      const id = line.split(':')[0]
      const roomid = line.split(':')[1]
      if (isNaN(Number(id)) || isNaN(Number(roomid))) continue
      const result = await amdb
        .find({ _id: Number(id) })
        .limit(1)
        .toArray()
      if (result.length !== 0) continue
      await amdb.insertOne({
        _id: Number(id),
        status: 1,
        roomid: Number(roomid)
      })
    } catch (e) {
      console.log('TRDB ERR at line ' + line)
      console.log(e)
    }
  }
  amdb.createIndex(
    {
      // _id: -1,
      roomid: -1,
      livets: -1
      // ts: -1
    },
    (e, s) => {}
  )
  amdb.createIndex(
    {
      _id: -1
    },
    (e, s) => {}
  )
  console.log('TRDB FINISHED')
}
