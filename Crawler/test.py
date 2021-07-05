# -*- coding:utf-8 -*-
import threading
import time
from crawler_NTU import NTU
from crawler_NTHU import NTHU
from crawler_NYTU import NYTU
import requests
from bs4 import BeautifulSoup
import json
import datetime

# #NTU
# t_NTU = threading.Thread(target = NTU.CourseList)
# # t_NTU = threading.Thread(target = NTU.getCourse())
# # NTHU
# t_NTHU = threading.Thread(target = NTHU.CourseList)
# # NYTU
# t_NYTU = threading.Thread(target = NYTU.CourseList)
#
#
# t_NTU.start()
# t_NTHU.start()
# t_NYTU.start()
#

# NTU.getCourse()


# # 等待 t 這個子執行緒結束
# t_NTU.join()
# print("NTU crawler complete!")
#
# t_NTHU.join()
# print("NTHU crawler complete!")

# info-strings

# YOUTUBE_API_KEY = config["YOUTUBE_API_KEY"]
#
# web_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id="+ "NV5jYlyEbXU" +"&key=" + YOUTUBE_API_KEY
# web_url = "https://ocw.nctu.edu.tw/course_detail-v.php?bgid=25&gid=0&nid=637"

# category_pages = ["category/1","category/2","category/3","category/4","new-intellectuals"]
# all_category = []
# count = 0
# for category_page in range(1,2):
#     web_url ="https://ocw.nthu.edu.tw/ocw/index.php?page=mediaList&keyword=&maximum=5000&classid=" + str(category_page)
#     print(web_url)
#     my_headers = {
#                 'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'
#             }
#     # #
#     req = requests.get(web_url, headers=my_headers, timeout =60)
#     req.encoding = "utf-8"
#     soup = BeautifulSoup(req.text, "html.parser")
#     all_class_names = soup.find_all("div",{"class":"singleCaption"})
#     print(all_class_names)
    # if category_page != "new-intellectuals":
    #     category_courses = soup.find(id="home-tab"+str(category_pages.index(category_page)+1)).find_all("div",{"class":"coursetitle"})
    # else:
    #     category_courses = soup.find(id="coubox5").find_all("div", {"class": "coursetitle"})
    # temp = []
    # for category_course in category_courses:
    #     temp.append(category_course.text.strip())
    # all_category.append(temp)
    # # print(temp,len(temp))
    # count += len(temp)


# insert into lectures (lecture_id, course_id, lecture_name,
#                     lecture_video, lecture_note, lecture_reference)
#                     values ('112237001', '112237', '單元 1．(1)\tPrinciples of protein extraction (animation)', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/109S203/1/V/1?v=ntu', '', '')
# para = ('台灣大學', '104', '農藝系', '生農醫衛', '2016-02', '咖啡學', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/104S207.jpg', '王裕文', '由於台灣並非咖啡的主要生產國，咖啡在台灣也非主要的經濟作物，但國人消費咖啡的習慣正逐年增加，因此咖啡課程在台灣的主要教授內容應著重在咖啡選購方面。本課程的主要目標將著重在咖啡品質的分辨與優缺點的判定。課程內容包括咖啡栽培管理與咖啡飲料的製作等項目，透過咖啡栽培管理的說明使同學了解咖啡各項特色及優缺點的成因。 咖啡品質的判定主要依賴官能鑑定，因此本課程特別強調官能鑑定的實作，務使同學經由咖啡實品的飲用比較，了解區分咖啡的各項特徵。咖啡官能鑑定的進度是以逐步建立咖啡官能鑑定程序來使學生了解各步驟的緣由與理論基礎，建立程序之後便開始利用來自各國各產區的咖啡樣品進行官能鑑定。 為使同學能有系統的認識咖啡的各種特色，除了利用各種咖啡樣品進行官能鑑定，對這些樣品的特色進行適當的描述也是必要的手段，但是每個人的形容詞各有不同，因此建立咖啡特色描述的形容詞彙是本課程的另一項重點。本課程準備了一套包含各種固體香料及液體香精油來做為各種形容詞彙的官能判定與討論的基礎。', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/104S207')
# # new_para = tuple(list(para)[1:-2])
# last_course_id = 1
# new_para = list(para[1:])
# new_para.insert(0,last_course_id)
# print(new_para)
# # select count(*) from courses where course_university = '台灣大學'
# # select course_id from courses where course_university = '清華大學' order by course_id DESC limit 1;
# insert into lectures (lecture_id, course_id, lecture_name, lecture_video, lecture_note,lecture_reference)
# values ('113141001', '113141', '課程介紹', 'https://ocwvideo.nctu.edu.tw/pub/mp4/sta001_mp4/sta001_110915.mp4' , '' ,'' )

# web_url ="https://www.youtube.com/embed/nj_DtqVJMrs?autoplay=0&showinfo=0&enablejsapi=1&widgetid=1"
# print(web_url)
# my_headers = {
#             'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'
#         }
# # #
# req = requests.get(web_url, headers=my_headers, timeout =60)
# req.encoding = "utf-8"
# soup = BeautifulSoup(req.text, "html.parser")
# print(soup)
# div = soup.find("div",{"class":"ytp-cued-thumbnail-overlay-image"})
# print(div)
