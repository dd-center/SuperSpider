const MongoClient = require('mongodb').MongoClient
const rp = require('request-promise-native')

const conv = require('./utils/nameConv')

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

;(async () => {
  const client = new MongoClient(
    `mongodb://admin:${process.argv[3]}@${
      process.argv[4]
    }:27017/admin?authMechanism=DEFAULT`,
    { useNewUrlParser: true }
  )

  try {
    await client.connect()

    const amdb = client.db('amdb').collection('maindb')
    const utrdb = client.db('amdb').collection('utrdb')

    const lim = process.argv[2] ? Number(process.argv[2]) : 86696

    console.log(lim)

    const cursor = amdb.find({ _id: { $gt: lim } })
    while (await cursor.hasNext()) {
      const item = await cursor.next()

      // console.log(`Tr launched using lim ${lim} | ID: ${item._id}.`)

      if (Number(item._id) < Number(lim)) continue

      if (!(item.msgjpn && item.msgjpn !== '')) {
        const trData = JSON.parse(
          await rp(
            'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo?id=' +
              item._id
          )
        ).data
        // console.log('TR: ')
        console.log(`id: ${item._id} / jpn: ${trData.message_trans}`)
        try {
          await amdb.updateOne(
            { _id: item._id },
            {
              $set: {
                msgjpn: trData.message_trans,
                status: trData !== '' ? 3 : 2
              }
            }
          )
        } catch (e) {
          console.log('ERR at id ' + item._id)
          console.log(e)
        }
      }

      if (!(item.unamejpn && item.unamejpn !== '')) {
        // console.log('Un launched.')
        let unData = ''
        const uf = await utrdb
          .find({ uname: item.uname })
          .limit(1)
          .toArray()
        if (uf.length > 0 && uf[0].unamejpn && uf[0].unamejpn !== '') {
          unData = uf[0].unamejpn
          console.log('UN: ADD by UTRDB')
        } else {
          unData = await conv(item.uname)
          console.log('UN: ADD by CONV')
          try {
            await utrdb.insertOne({ uname: item.uname, unamejpn: unData })
          } catch (e) {
            console.log('ERR at UN insert utrdb: ' + unData)
            console.log(e)
          }
        }
        console.log(`id: ${item._id} / unamejpn: ${unData}`)
        try {
          await amdb.updateOne(
            { _id: item._id },
            { $set: { unamejpn: unData } }
          )
        } catch (e) {
          console.log('ERR at id ' + item._id)
          console.log(e)
        }
      }

      // await sleep(2000)
    }
  } catch (err) {
    console.log('ERR when connect to AMDB')
    console.log(err)
    process.exit(1)
  }
})()
