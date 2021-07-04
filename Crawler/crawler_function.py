from proxy import Proxy_handler
import requests
from bs4 import BeautifulSoup
import random



class getData:
    def __init__(self):
        pass

    def getWebContent(self, base_url=None, page=""):
        web_url = base_url + str(page)
        my_headers = {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'
        }

        while True:
            try:
                # print("try no proxy")
                req = requests.get(web_url, headers=my_headers, timeout =60)
                # req = requests.get(web_url, headers=my_headers, proxies=proxies, timeout=10)
                if req.status_code == 200:
                    break
            except:
                print("try proxy again")
                #update proxy
                Proxy_handler.getProxy()
                proxies_list = Proxy_handler.read_proxy()
                proxies = random.choice(proxies_list)
                req = requests.get(web_url, headers=my_headers, proxies=proxies, timeout=60)
                # req = requests.get(web_url, headers=my_headers, timeout=10)
                if req.status_code == 200:
                    break

        req.encoding = "utf-8"
        if req.status_code != 200:
            print(f"Connection Fail,{req.status_code}")
            return
        soup = BeautifulSoup(req.text, "html.parser")
        # print(soup.prettify())
        return soup
