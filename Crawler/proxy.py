import json
import telnetlib
import requests

class proxy_handle:
    def __init__(self):
        self.proxy_url = 'https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list'


    def verify(self,ip,port,type): #驗證proxy
        proxies = {}
        try:
            telnet = telnetlib.Telnet(ip,port=port,timeout=3)
        except:
            print('unconnected')
            return False
        else:
            #print('connected successfully')
            # proxyList.append((ip + ':' + str(port),type))
            proxies['type'] = type
            proxies['host'] = ip
            proxies['port'] = port
            proxiesJson = json.dumps(proxies)
            with open('verified_proxies.json','a+') as f: #save effective proxy into json file
                f.write(proxiesJson + '\n')
            print("已寫入：%s" % proxies)
            return True

    def getProxy(self): #get potential proxy link
        response = requests.get(self.proxy_url)
        proxies_list = response.text.split('\n')
        count = 0
        for proxy_str in proxies_list:
            if count == 10: # 只取前面十筆
                break
            if not proxy_str:
                print("proxy process end")
                break
            proxy_json = json.loads(proxy_str)
            host = proxy_json['host']
            port = proxy_json['port']
            type = proxy_json['type']
            if self.verify(host,port,type):
                count += 1

    def read_proxy(self): #read effective proxy json file and return proxy list
        with open('verified_proxies.json', 'r') as f:
            proxies_list = []
            isContinue = True
            while isContinue:
                proxy = f.readline().strip()
                # print(proxy)
                if proxy:
                    proxy = json.loads(proxy)
                    type = proxy["type"]
                    host = str(proxy["host"])
                    port = str(proxy["port"])
                    data = {type: type + "://" + host + ":" + port}
                    proxies_list.append(data)
                else:
                    isContinue = False
        return proxies_list

Proxy_handler = proxy_handle()

# if __name__ == '__main__':
#     getProxy(proxy_url)