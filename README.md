# SuperSpider

走召虫——BiliBili SuperChat 爬虫

## Using Docker

### DB

Run using:

`docker run -d -p 2161:2161 -v /scdb:/scdb afanyiyu/superspider-db`

Internal build using:

`docker build -t afanyiyu/superspider-db github.com/dd-center/SuperSpider#master:packages/superspider-db`
