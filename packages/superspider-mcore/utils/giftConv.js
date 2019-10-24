if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : ''
    })
  }
}

const giftData = [
  {
    value: 1245,
    color: {
      pcolor: '#E62117',
      bcolor: '#D00000'
    }
  },
  {
    value: 450,
    color: {
      pcolor: '#E91E63',
      bcolor: '#C2185B'
    }
  },
  {
    value: 300,
    color: {
      pcolor: '#F57C00',
      bcolor: '#E65100'
    }
  },
  {
    value: 100,
    color: {
      pcolor: '#FFCA28',
      bcolor: '#FFB300'
    }
  },
  {
    value: 50,
    color: {
      pcolor: '#1DE9B6',
      bcolor: '#00BFA5'
    }
  },
  {
    value: 0,
    color: {
      pcolor: '#00E5FF',
      bcolor: '#00B8D4'
    }
  }
]

const typeData = [
  {
    value: 1,
    data: {
      msg: '{0}在本房间开通了总督！',
      msgjpn: '{0}はこのチャンネルで知事を開きました！'
    }
  },
  {
    value: 2,
    data: {
      msg: '{0}在本房间开通了提督！',
      msgjpn: '{0}はこのチャンネルで提督を開いた！'
    }
  },
  {
    value: 3,
    data: {
      msg: '{0}在本房间开通了舰长！',
      msgjpn: '{0}はこのチャンネルでキャプテンを開けました！'
    }
  },
  {
    value: 4,
    data: {
      msg: '{0}在本房间送出了{1}！',
      msgjpn: '{1}を送信しました！'
    }
  }
]

module.exports = function(data) {
  let color = {}
  let type = {}
  for (i of giftData) {
    if (Number(data.price) > i.value) {
      color = i.color
      break
    }
  }
  let gift = ''
  if (data.num) gift = data.gift + 'x' + data.num
  else gift = data.gift
  for (i of typeData) {
    if (Number(data.type) == i.value) {
      type = {
        msg: i.data.msg.format(data.uname, gift),
        msgjpn: i.data.msgjpn.format(data.uname, gift)
      }
      break
    }
  }
  return {
    _id: -1,
    status: 3,
    msgtr: '',
    trstatus: 0,
    ...color,
    ...type
  }
}
