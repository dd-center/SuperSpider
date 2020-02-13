// const { once } = require('events')
const fs = require('fs')
const readline = require('readline')
const rp = require('request-promise-native')

module.exports = async function() {
  console.log('TRDB STARTED')
  const roomList = await fs.promises.readdir('/scdb/rdb')
  for (const room of roomList) {
    await fs.promises.mkdir('/scdb/rdb2/' + room, { recursive: true })
    const fileList = await fs.promises.readdir('/scdb/rdb/' + room)
    for (const file of fileList) {
      let output = ''
      const fileStream = fs.createReadStream('/scdb/rdb/' + room + '/' + file)
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      })
      // rl.on('line', async (line) => {
      for await (const line of rl) {
        if (line.split(':').length < 1) continue
        const data = JSON.parse(
          await rp({
            uri: 'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo',
            qs: {
              id: line.split(':')[0]
            }
          })
        )
        output +=
          data.data.id +
          ':' +
          room +
          ':' +
          data.data.ts +
          ':' +
          data.data.uid +
          ':' +
          data.data.price +
          ':' +
          data.data.message.replace(/\s*/g, '').replace(/[\r\n]/g, '') +
          '\n'
        // ':' +
        // data.data.message_trans
        await fs.promises.appendFile(
          '/scdb/tdb/tlist',
          data.data.id + ':' + room + '\n'
        )
      }
      // await once(rl, 'close')
      await fs.promises.writeFile('/scdb/rdb2/' + room + '/' + file, output)
    }
  }
  console.log('TRDB FINISHED')
}
