const rp = require('request-promise-native')

module.exports = async function() {
  const list = []
  let i = 1
  while (true) {
    const data = JSON.parse(
      await rp(
        'https://api.live.bilibili.com/room/v3/area/getRoomList?platform=web&parent_area_id=1&cate_id=0&area_id=199&sort_type=online&page=' +
          i +
          '&page_size=20&tag_version=1'
      )
    )
    if (data.data.list.length <= 0) break
    for (const item of data.data.list) {
      list.push(Number(item.roomid))
    }
    i++
  }
  return list
}
