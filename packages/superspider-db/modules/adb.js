const fs = require('fs')
const readline = require('readline')
const rp = require('request-promise-native')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = async function() {
  if (global.adbRunning) return
  global.adbRunning = true
  await fs.promises.mkdir('/scdb/adb', { recursive: true })
  await fs.promises.mkdir('/scdb/tdb', { recursive: true })
  await fs.promises.mkdir('/scdb/xdb', { recursive: true })
  let count = 1
  let xCount = 1
  try {
    xCount = parseInt(await fs.promises.readFile('/scdb/adb/count'))
    count = xCount
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
        break
      }
      try {
        await fs.promises.appendFile(
          '/scdb/adb/db',
          data.data.id +
            ':' +
            data.data.ts +
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
        break
      }
    } catch (e) {
      console.log('ERR when adb rp ' + count)
      console.log(e)
    }
    // console.log('RUN here at count ' + count)
    count++
  } while (true)
  await delay(10000)
  const fileStream = fs.createReadStream('/scdb/adb/db')
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  rl.on('line', async (line) => {
    if (line.split(':').length < 1) return
    const id = line.split(':')[0]
    let data = ''
    for (const i of line.split(':').slice(1)) {
      data += ':' + i
    }
    try {
      const fstr = fs.createReadStream('/scdb/tdb/tlist')
      const r = readline.createInterface({
        input: fstr,
        crlfDelay: Infinity
      })
      let rid = ''
      r.on('line', async (li) => {
        if (li.split(':').length < 1) return
        if (li.split(':')[0] === id) rid = li.split(':')[1]
      })
      await once(r, 'close')
      await fs.promises.appendFile('/scdb/xdb/db', id + ':' + rid + data + '\n')
    } catch (e) {
      console.log('ERR when fetch tlist')
      console.log(e)
    }
  })
  await once(rl, 'close')
  global.adbRunning = false
}
