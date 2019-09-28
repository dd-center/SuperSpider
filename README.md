# SuperSpider

走召虫——BiliBili SuperChat 爬虫

## 端口表

| APP     | PORT |
| ------- | ---- |
| DB      | 2161 |
| Core    | 2162 |
| ANA     | 2163 |
| Website | 2164 |

## 数据格式

除`ADB`中的数据为`ID:UID:TS（时间戳）:内容`之外，其他数据格式均为`ID:房间号:UID:TS（时间戳）:内容`。

## Deploy

### DB

Run using:

`docker run -d -p 2161:2161 -v /scdb:/scdb afanyiyu/superspider-db`

Internal build using:

`docker build -t afanyiyu/superspider-db github.com/dd-center/SuperSpider#master:packages/superspider-db`

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

## 捐赠

您的捐赠是对该项目及我本人的支持。本项目获得的所有捐赠将会全部用于服务器的维护。

![Alipay](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Alipay.jpg)

![Wechat](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/Wechat.png)

![WechatReward](https://raw.githubusercontent.com/dd-center/SuperSpider/master/docs/pay/WechatReward.png)
