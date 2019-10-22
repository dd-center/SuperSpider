import urllib.request
import urllib
import requests
import re
import time
import random

proxys = []

def show_interface():
    choice=input("请选择功能：1.显示可用代理；2.显示可用代理并生成文本；3.退出系统:")
    return choice

def get_proxyIP():
    ip_title=[]#IP列表
    try:
        print('想要爬取多少个代理IP页面？')
        page_num=input('每个页面包含100个IP地址,输入数值大于等于1，小于等于705（最好在15以内，多了会崩溃）')
        if int(page_num)<1 or int(page_num)>705:
            print(">>>>>输入错误( ⊙ o ⊙ )！")
            return ip_title
        else:
            for i in range(1,int(page_num)+1):
                url='http://www.xicidaili.com/nt/'+str(i)
                headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64)"}
                request=urllib.request.Request(url=url,headers=headers)
                response=urllib.request.urlopen(request)
                content=response.read().decode('utf-8')
                pattern=re.compile('<td>(\d.*?|HTTP|HTTPS)</td>')
                ip_page=re.findall(pattern,str(content))
                ip_title.extend(ip_page)
                time.sleep(random.choice(range(1,3)))
            print('代理IP地址              ','\t','端口','\t','类型','\t\t\t','存活时间','\t\t','验证时间')
            for i in range(0,len(ip_title),5):
                if len(ip_title[i])<14 and len(ip_title[i])>10:
                    print(ip_title[i],'           ','\t',ip_title[i+1],'\t',ip_title[i+2],'\t\t\t',ip_title[i+3],'\t\t',ip_title[i+4])
                elif len(ip_title[i])<=10:
                    print(ip_title[i], '             ', '\t', ip_title[i + 1],'\t', ip_title[i + 2],'\t\t\t', ip_title[i + 3],'\t\t',ip_title[i+4])
                else:
                    print(ip_title[i],'          ','\t',ip_title[i+1],'\t',ip_title[i+2],'\t\t\t',ip_title[i+3],'\t\t',ip_title[i+4])
            return ip_title
    except ValueError:
        print(">>>>>输入错误( ⊙ o ⊙ )！")
        return ip_title

proxy_ip=open('ip.txt','w')#新建文档存储有效IP

def effective_IP(ip_title):
    url='https://www.cnblogs.com/sjzh/p/5990152.html'
    try:
        for i in range(0,len(ip_title),5):
            ip={ip_title[i+2]:ip_title[i]+":"+ip_title[i+1]}
            proxy_support=urllib.request.ProxyHandler(ip)
            opener=urllib.request.build_opener(proxy_support)
            opener.addheaders=[('User-Agent','Mozilla/5.0 (Windows NT 10.0; WOW64)')]
            urllib.request.install_opener(opener)
            res=urllib.request.urlopen(url).read()
            print(ip_title[i]+':'+ip_title[i+1],'is OK')
            proxy_ip.write('%s\n'%str(ip_title[i]+':'+ip_title[i+1]))#写入IP
        print('总共爬取了'+str(len(ip_title)/5)+'个有效IP')
    except Exception as e:
        print(i,e)

if __name__=='__main__':
    print('代理IP抓取')
    choice = show_interface()
    while True:
        if choice=='1':
            get_proxyIP()
            i=input(">>>>>还想继续使用该系统？(Y/N):")
            if i=='Y' or i=='y':
                choice=show_interface()
            else:
                break

        if choice=='2':
            ip_title=get_proxyIP()
            effective_IP(ip_title)
            i = input(">>>>>还想继续使用该系统？(Y/N):")
            if i == 'Y' or i == 'y':
                choice = show_interface()
            else:
                break
        if choice=='3':
            break