module.exports = function(str) {
  if (str.slice(0, 1) == ':') return false
  const data = str.split(':')
  if (data.length < 4) return false
  const id = data[0]
  if (isNaN(Number(id))) return false
  return {
    id: data[0],
    roomid: data[1],
    uid: data[2],
    ts: data[3],
    msg: data.length < 5 ? '' : data[4]
  }
}
