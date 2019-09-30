// const { once } = require('events')
const fs = require('fs')
const readline = require('readline')

const MongoClient = require('mongodb').MongoClient

module.exports = async function() {
  console.log('TRDB STARTED')
  const client = new MongoClient(
    process.env.NODE_ENV == 'development'
      ? 'mongodb://localhost:27017/amdb'
      : 'mongodb://172.18.0.1:27017/amdb',
    { useNewUrlParser: true }
  )
  let amdb = false
  try {
    await client.connect()

    amdb = client.db('amdb').collection('maindb')
  } catch (err) {
    console.log('ERR when connect to AMDB')
    console.log(err)
    process.exit(1)
  }
  if (!amdb) {
    console.log('ERR when check AMDB')
    return
  }
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
        .find({ _id: id })
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
