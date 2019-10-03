const rp = require('request-promise-native')
const cheerio = require('cheerio')

module.exports = async function(name) {
  const body = await rp({
    uri:
      'https://www.ltool.net/chinese-simplified-and-traditional-characters-pinyin-to-katakana-converter-in-simplified-chinese.php',
    method: 'POST',
    form: {
      contents: name,
      option: 2
    },
    transform: function(body) {
      return cheerio.load(body)
    }
  })
  return cheerio.load(body('.finalresult').html()).text()
}
