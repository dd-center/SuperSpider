# SuperSpider

走召虫——BiliBili SuperChat 爬虫

![Annotation 2019-09-28 202251](https://user-images.githubusercontent.com/20179549/65817757-acb5f880-e23d-11e9-93c6-e5ff445b9880.png)

## 端口表

| APP     | PORT |
| ------- | ---- |
| DB      | 2161 |
| Core    | 2162 |
| ANA     | 2163 |
| Website | 2164 |
| AtHome  | 2165 |
| MDB     | 2166 |

## 数据格式（SCDB/TXTDB）

除`ADB`中的数据为`ID:UID:TS（时间戳）:内容`之外，其他数据格式均为`ID:房间号:UID:TS（时间戳）:内容`。

## 数据格式（ADB/MongoDB）

`mongodb://172.18.0.1:27017/amdb/maindb`

```json with comments
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
  "avatar": "https://static.hdslb.com/images/member/noface.gif",
  "price": 30,
  "msg": "",
  "msgjpn": "",
  "msgtr": "",
  // 冻肉
  "trstatus": 0,
  // 翻译者鉴权
  "tr": 1,
  // 翻译者
  "bcolor": "",
  "pcolor": "",
  "exrate": "",
  "hide": 0
}
```

## Deploy

### DB

Run using:

`docker run -d -p 2161:2161 -v /scdb:/scdb afanyiyu/superspider-db`

Internal build using:

`docker build -t afanyiyu/superspider-db github.com/dd-center/SuperSpider#master:packages/superspider-db`

### MDB

Run using:

`docker run -d -p 2165:2165 -p 2166:2166 -v /scdb:/scdb afanyiyu/superspider-mdb`

Internal build using:

`docker build -t afanyiyu/superspider-mdb github.com/dd-center/SuperSpider#master:packages/superspider-mdb`

### Core

Run using:

`docker run -d -p 2162:2162 -v /scdb:/scdb afanyiyu/superspider-core`

Internal build using:

`docker build -t afanyiyu/superspider-core github.com/dd-center/SuperSpider#master:packages/superspider-core`

### ANA

Run using:

`docker run -d -p 2163:2163 -v /scdb:/scdb afanyiyu/superspider-ana`

Internal build using:

`docker build -t afanyiyu/superspider-ana github.com/dd-center/SuperSpider#master:packages/superspider-ana`

### Website

Run using:

`docker run -d -p 2164:2164 afanyiyu/superspider-showcase`

Internal build using:

`docker build -t afanyiyu/superspider-showcase github.com/dd-center/SuperSpider#master:packages/superspider-showcase`

### AtHome

Run using:

`docker run -d afanyiyu/superspider-athome`

Internal build using:

`docker build -t afanyiyu/superspider-athome github.com/dd-center/SuperSpider#master:packages/superspider-athome`

## 捐赠

您的捐赠是对该项目及我本人的支持。本项目获得的所有捐赠将会全部用于服务器的维护。

![Alipay](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Alipay.jpg)

![Wechat](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Wechat.png)

![WechatReward](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/WechatReward.png)
