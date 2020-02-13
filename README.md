<div align="center">
  <h1><a href="https://docs.bilisc.com/" target="_blank">BiliSC</a></h1>

  <p style="font-size: 20px;">若要转到用户手册，请直接点击上面的链接。</p>

![Stars](https://img.shields.io/github/stars/dd-center/superspider?color=brightgreen&style=flat-square)
![Language](https://img.shields.io/badge/language-javascript-brightgreen?logo=javascript&style=flat-square)
![I18N](https://img.shields.io/badge/i18n-zh%7Cjp-brightgreen?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)
![License](https://img.shields.io/github/license/dd-center/superspider?style=flat-square)

</div>

## 👏 截图

![Screenshot](https://user-images.githubusercontent.com/20179549/65817757-acb5f880-e23d-11e9-93c6-e5ff445b9880.png)

## 独立组件指南

| 组件    | 端口 | 功能                  | 状态   |
| ------- | ---- | --------------------- | ------ |
| DB      | 2161 | 基于 TxtDB 存储的爬虫 | 已弃用 |
| Core    | 2162 | 基于 TxtDB 的后端     | 已弃用 |
| MDB     | 2166 | 基于 MongoDB 的爬虫   | 使用中 |
| MCore   | 2162 | 基于 MongoDB 的后端   | 使用中 |
| ANA     | 2163 | 日常维护服务          | 已弃用 |
| Website | 2164 | BiliSC 前端           | 使用中 |
| AtHome  | 2165 | 分布式爬虫            | 未启用 |

## SC 数据格式（MongoDB）

`mongodb://172.18.0.1:27017/amdb/maindb`

```jsonc
{
  "_id": 1,
  "status": 0,
  // 0: 没有该项数据
  // 1: 仅有id和roomid
  // 2: 没有机翻
  // 3: 数据完整
  // 4: 人工翻译
  "roomid": 1,
  "livets": 10000,
  "ts": 10000,
  "uname": "用户名",
  "unamejpn": "名前",
  "avatar": "https://static.hdslb.com/images/member/noface.gif",
  "price": 30,
  "msg": "",
  "msgjpn": "",
  "msgtr": "",
  // 冻肉
  "trstatus": 0,
  // 翻译者鉴权
  "bcolor": "",
  "pcolor": "",
  "exrate": "",
  "hide": 0
}
```

## 送礼物/上舰数据格式（PreDB）

`mongodb://172.18.0.1:27017/amdb/predb`

```jsonc
{
  "_id": "ObjectId()",
  "type": 0,
  // 0: 预留
  // 1: 总督
  // 2: 提督
  // 3: 舰长
  // 4: 金瓜子礼物
  "roomid": 1,
  "livets": 10000,
  "ts": 10000,
  "uname": "用户名",
  "unamejpn": "名前",
  "avatar": "https://static.hdslb.com/images/member/noface.gif",
  "price": 30,
  "exrate": "",
  "hide": 0,
  "gift": "辣条",
  "num": 1
}
```

## 自部署

`docker run -d -p <端口号>:<端口号> -v /scdb:/scdb -e MONGODB_PASS=PASS -e MONGODB_IP=IP afanyiyu/superspider-<独立组件名称>`

## 捐赠

您的捐赠是对该项目及我本人的支持。本项目获得的所有捐赠将会全部用于服务器的维护。

![Alipay](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Alipay.jpg)
![Wechat](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Wechat.png)
![WechatReward](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/WechatReward.png)
