const fs = require('fs')
const rp = require('request-promise-native')

module.exports = async function() {
  if (global.adbRunning) return
  global.adbRunning = true
  await fs.promises.mkdir('/scdb/adb', { recursive: true })
  let count = 1
  try {
    count = parseInt(await fs.promises.readFile('/scdb/adb/count'))
  } catch (e) {
    console.log('ERR when read adb count')
    console.log(e)
  }
  do {
    try {
      const data = JSON.parse(
        await rp({
          uri: 'https://api.live.bilibili.com/av/v1/SuperChat/messageInfo',
          qs: {
            id: count
          }
        })
      )
      if (data.code !== 0) {
        await fs.promises.writeFile('/scdb/adb/count', count)
        global.adbRunning = false
        return
      }
      try {
        await fs.promises.appendFile(
          '/scdb/adb/db',
          data.data.id +
            ':' +
            data.data.uid +
            ':' +
            data.data.price +
            ':' +
            data.data.message +
            '\n'
          // ':' +
          // data.data.message_jpn
        )
      } catch (e) {
        console.log('ERR when adb append')
        console.log(e)
        return
      }
    } catch (e) {
      console.log('ERR when adb rp ' + count)
      console.log(e)
    }
    console.log('RUN here at count ' + count)
    count++
  } while (true)
}
