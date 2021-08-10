# 發想
在程式學習的過程中，上過一些線上課程，包含付費與免費的課，付費如：Coursea, Udemy，免費如：MIT、Harvard、台清交大OCW資源。<br>
發現許多大學的線上課程，其實都是非常好的學習資源，但僅僅只有影片與課堂講義，並沒有讓學習者能記錄自己學習筆記、歷程，甚至如遊戲化的進度等功能。<br>
因此結合國內OCW免費資源，加上上述功能，希望能讓國內更多免費資源被多加運用，並讓學習者更具有學習熱忱！<br>


# Demo
## click <a href="https://ocw.notebook.blucas0707.com/" target="_blank">here</a>

### 課程展示＆關鍵字查找
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E8%AA%B2%E7%A8%8B%E5%B1%95%E7%A4%BA%E8%88%87%E9%97%9C%E9%8D%B5%E5%AD%97%E6%9F%A5%E6%89%BE.gif)

### 會員登入＆影片時間＆筆記功能
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E7%99%BB%E5%85%A5%E5%BD%B1%E7%89%87%E6%99%82%E9%96%93%E7%AD%86%E8%A8%98.gif)

### 手勢偵測
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E6%89%8B%E5%8B%A2%E5%81%B5%E6%B8%AC.gif)

### 學習紀錄
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E5%AD%B8%E7%BF%92%E7%B4%80%E9%8C%84.gif)

### 會員資料修改
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E5%A7%93%E5%90%8D%E5%AF%86%E7%A2%BC%E4%BF%AE%E6%94%B9.gif)


# 功能
1. 會員：會員註冊／登入／登出／修改名稱、密碼／訂閱
2. 課程：課程瀏覽類別查找／關鍵字查找
3. 筆記：新增、刪除筆記／返回當下影片時間
4. 影片：影片觀看時間紀錄／判斷完成度(>85%)／手勢辨識互動
5. 紀錄：課堂學習進度百分比／課程類別、進度查找

# 流程

### 流程圖
<img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/All.png" alt="" width="100%"/>

### Data Collect & Storage
<img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/OCW%20data%20flow.png" alt="" width="50%"/>

預先定義所需資料格式並用Python 分別爬取NTU, NTHU, NYCU三個學校的OCW課程資料。<br>
這邊分成三個module: crawler_NTHU.py / crawler_NTHU.py / crawler_NTU.py，方便主程式crawler.py用Threading 同步爬取降低所需時間。<br>
爬取的資料會預先存成json格式後，再存入AWS RDS MySQL中。<br>

*特別處理：
1. 爬蟲若是斷線，會使用verified_proxies.json中的ip 去做連線
2. NTU 因為http的CORS問題，因此先下載到local端，

### 關鍵字查找ElasticSearch

當Client使用關鍵字查找時，Server會將關鍵字傳到AWS ElasticSearch，並接收其回傳的智慧分詞結果，再回傳給Clent。

<img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/ElasticSearch%20flow.png" alt="" width="90%" />

但需要預先將SQL中的課程名稱、課程老師、課程類別、課程學校、課程敘述、課程圖片存到AWS ElasticSearch中，並設定中文智慧最大分詞。

*分詞Analyzer:
中文最大分詞(ik_max_word): "藝術文化生活" => "藝", "術", "文化生活", "文化", "化生", "生活"
中文智慧分詞(ik_smart): "藝術文化生活" => "藝", "術", "文化生活"

<img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/Save%20to%20ElasticSearch.png" alt="" width="50%"/>

```Python
 {
   "mappings": {
       "properties": {
         "course_name": {
           "type": "text",
           "analyzer": "ik_max_word",
           "search_analyzer": "ik_max_word"
         },
         "course_teacher": {
           "type": "text",
           "analyzer": "ik_max_word",
           "search_analyzer": "ik_max_word"
         },
         "course_category": {
           "type": "text",
           "analyzer": "ik_max_word",
           "search_analyzer": "ik_max_word"
         },
         "course_university": {
           "type": "text",
           "analyzer": "ik_max_word",
           "search_analyzer": "ik_max_word"
         },
 	    "course_description": {
           "type": "text",
           "analyzer": "ik_max_word",
           "search_analyzer": "ik_max_word"
         },
         "course_cover": {
           "type": "text",
         }
       }
   }
 }

```
<<<<<<< HEAD
=======






>>>>>>> e5ace72178acee750684a13efa849b7de269be00

