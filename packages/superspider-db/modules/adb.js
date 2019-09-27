// const { once } = require('events')
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
    // console.log('ERR when read adb count')
    // console.log(e)
    console.log('ADB Initialized. ')
  }
  // console.log('ADB Runs at ' + xCount)
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
            data.data.message.replace(/\s*/g, '').replace(/[\r\n]/g, '') +
            '\n'
          // ':' +
          // data.data.message_jpn
        )
      } catch (e) {
        console.log('ERR when adb append')
        // console.log(e)
        break
      }
    } catch (e) {
      console.log('ERR when adb rp ' + count)
      // console.log(e)
    }
    // console.log('RUN here at count ' + count)
    count++
  } while (true)
  await delay(3000)
  const fst = fs.createReadStream('/scdb/adb/db')
  const rlt = readline.createInterface({
    input: fst,
    crlfDelay: Infinity
  })
  for await (const line of rlt) {
    if (line.slice(0, 1) == ':') continue
    if (line.split(':').length < 1) continue
    const id = line.split(':')[0]
    if (isNaN(Number(id))) continue
    if (Number(id) < xCount) continue
    await fs.promises.appendFile('/scdb/adb/db2', line + '\n')
  }
  await delay(3000)
  const fileStream = fs.createReadStream('/scdb/adb/db2')
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (const line of rl) {
    if (line.slice(0, 1) == ':') continue
    if (line.split(':').length < 1) continue
    const id = line.split(':')[0]
    if (isNaN(Number(id))) continue
    if (Number(id) < xCount) continue
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
      let rid = '-1'
      for await (const li of r) {
        if (li.split(':').length < 1) continue
        if (li.split(':')[0] == id) rid = li.split(':')[1]
      }
      // await once(r, 'close')
      await fs.promises.appendFile('/scdb/xdb/db', id + ':' + rid + data + '\n')
    } catch (e) {
      console.log('ERR when fetch tlist')
      // console.log(e)
    }
  }
  // await once(rl, 'close')
  global.adbRunning = false
}
