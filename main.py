from crawler import NTU,NTHU,NYTU
import json
import datetime
import requests
import random
import os

# startTime = datetime.datetime.now()
# for i in range(100000000):
#     pass
# endTime = datetime.datetime.now()
# print(f"Duration: {endTime - startTime}")

#NTU ~20 mins, done
# NTU.CourseList()

# NTU.latest_course()
# NTHU.CourseList()
# NYTU.CourseList()

# NTHU.getCourse()

## get proxy
# with open('verified_proxies.json', 'r') as f:
#     proxies_list = []
#     isContinue = True
#     while isContinue:
#         proxy = f.readline().strip()
#         # print(proxy)
#         if proxy:
#             proxy = json.loads(proxy)
#             type = proxy["type"]
#             host = str(proxy["host"])
#             port = str(proxy["port"])
#             data = {type:type+"://"+host+":"+port}
#             proxies_list.append(data)
#         else:
#             isContinue = False
#     # print(proxies_list)
# proxy = random.choice(proxies_list)
# print(proxy)
# req = requests.get("http://httpbin.org/get", proxies = proxy)
# print(req.text)

# #get file modify time
# NTU_file_time = os.path.getmtime("NTU.json")
# datetimeObj = datetime.datetime.fromtimestamp(NTU_file_time).strftime('%Y/%m/%d')
# print(datetimeObj)
