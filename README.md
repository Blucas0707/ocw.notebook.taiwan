# 發想 Idea
在程式學習的過程中，上過一些線上課程，包含付費與免費的課，付費如：Coursea, Udemy，免費如：MIT、Harvard、台清交大OCW資源。<br>
發現許多大學的線上課程，其實都是非常好的學習資源，但僅僅只有影片與課堂講義，並沒有讓學習者能記錄自己學習筆記、歷程，甚至如遊戲化的進度等功能。<br>
因此結合國內OCW免費資源，加上上述功能，希望能讓國內更多免費資源被多加運用，並讓學習者更具有學習熱忱！<br>

During the process of learning programming, I have taken several online courses, including both paid and free ones. The paid courses include platforms like Coursera and Udemy, while the free ones include resources from institutions such as MIT, Harvard, and National Taiwan University's OCW.<br>

I have noticed that many online courses offered by universities are excellent learning resources. However, they often consist only of videos and lecture notes, lacking features that allow learners to record their own study notes, progress, or even gamified elements.<br>

Therefore, I propose combining the free resources from domestic OCW platforms with the aforementioned features. The aim is to encourage the utilization of more free resources domestically and to enhance learners' enthusiasm for studying!<br>


# Demo

### 課程展示＆關鍵字查找 Course Presentation & Keyword Search
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E8%AA%B2%E7%A8%8B%E5%B1%95%E7%A4%BA%E8%88%87%E9%97%9C%E9%8D%B5%E5%AD%97%E6%9F%A5%E6%89%BE.gif)

### 會員登入＆影片時間＆筆記功能 Member Login & Video Duration & Note-taking Function
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E7%99%BB%E5%85%A5%E5%BD%B1%E7%89%87%E6%99%82%E9%96%93%E7%AD%86%E8%A8%98.gif)

### 手勢偵測 Gesture Detection
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E6%89%8B%E5%8B%A2%E5%81%B5%E6%B8%AC.gif)

### 學習紀錄 Learn History
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E5%AD%B8%E7%BF%92%E7%B4%80%E9%8C%84.gif)

### 會員資料修改 Member Information Update
![image](https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/demo%20gif/%E5%A7%93%E5%90%8D%E5%AF%86%E7%A2%BC%E4%BF%AE%E6%94%B9.gif)

***

# 功能 Functionality
1. 會員：會員註冊／登入／登出／修改名稱、密碼／訂閱<br> Membership: Member registration/login/logout/modify name, password/subscription
2. 課程：課程瀏覽類別查找／關鍵字查找<br> Courses: Browse courses by category/keyword search
3. 筆記：新增、刪除筆記／返回當下影片時間<br> Notes: Add/delete notes/return to current video timestamp
4. 影片：影片觀看時間紀錄／判斷完成度(>85%)／手勢辨識互動<br> Videos: Video viewing time record/judgment of completion (>85%)/gesture recognition interaction
5. 紀錄：課堂學習進度百分比／課程類別、進度查找<br> Records: Percentage of progress in classroom learning/Course category and progress search

***

# 流程 Flow

### 流程圖 Flow Chart
<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/All.png" alt="" width="100%"/></div>

___

### 資料收集＆儲存 Data Collection & Storage
<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/OCW%20data%20flow.png" alt="" width="50%"/></div>

預先定義所需資料格式並用Python 分別爬取NTU, NTHU, NYCU三個學校的OCW課程資料。<br>
這邊分成三個module: crawler_NTHU.py / crawler_NTHU.py / crawler_NTU.py，方便主程式crawler.py用Threading 同步爬取降低所需時間。<br>
爬取的資料會預先存成json格式後，再存入AWS RDS MySQL中。<br>

Define the required data format in advance and use Python to crawl the OCW course data from three universities: NTU, NTHU, and NYCU.<br>

This task is divided into three modules: crawler_NTHU.py, crawler_NTHU.py, and crawler_NTU.py, to facilitate synchronous crawling using threading in the main program crawler.py and reduce the required time.<br>

The crawled data will be stored as JSON and then saved into AWS RDS MySQL.<br>

*特別處理：
1. 爬蟲若是斷線，會使用verified_proxies.json中的ip 去做連線
2. NTU 因為http的CORS問題，因此先下載到local端，再上傳到AWS S3，並使用Cloudfront，降低CDN延遲。

*Special handling:
1. If the crawler is disconnected, it will use the IP from verified_proxies.json for connection.
2. For NTU, due to the CORS issue with HTTP, the data is first downloaded to the local end, then uploaded to AWS S3, and Cloudfront is used to reduce CDN latency.

___

#### 資料庫配置 SQL Schema

共分 3 個 Database: User、Course、Learning 
There are a total of 3 databases: User, Course, and Learning.

1. DB: Course，包含兩個table: courses、lectures，courses，包含課程資訊，lectures包含課堂資訊（影片、講義、筆記等） <br>
DB: Course, which consists of two tables: courses and lectures. The courses table contains course information, while the lectures table contains information about individual class sessions (videos, handouts, notes, etc.). <br>

courses.course_id: primary key for courses, foreign key for lectures<br>
lectures.lecture_id: primary key for courses<br>
<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/SQL/course_lecture2.png" alt="" width="50%" /></div>

2. DB: User，包含一個table: users，包含會員資訊<br>
DB: User, including a table called "users" that contains member information. <be>
users.user_id: primary key for users, foreign key for notes, course_status, learnings<br>

3. DB: Learning，包含三個table: notes、course_status、learnings，包含筆記資訊、課程完成狀態、學習相關紀錄等<br>
DB: Learning, which consists of three tables: notes, course_status, and learnings, includes information about notes, course completion status, and learning records. <br>
notes.note_id: primary key for notes <br>
course_status.(user_id, course_id): primary key for course_status <br>
learnings.(user_id, course_id, lecture_id): primary key for learnings <br>

*特別處理：
1. 會員密碼會透過 hash-salt 加密放到SQL，確保資訊安全

*Special handling:
1. Member passwords will be encrypted using hash-salt and stored in SQL to ensure information security.

<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/SQL/user_note_status_learning.png" alt="" width="50%" /></div>

___

### 關鍵字查找 Keyword Search - ElasticSearch

當 Client 使用關鍵字查找時，Server 會將關鍵字傳到 AWS ElasticSearch，並接收其回傳的智慧分詞結果，再回傳給 Clent。<br>
<br>
When a client uses keywords to search, the server sends the keywords to AWS ElasticSearch and receives the returned intelligent tokenization results, which are then sent back to the client.<br>

<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/ElasticSearch%20flow.png" alt="" width="90%" /></div>
<br>
但需要預先將 SQL 中的課程名稱、課程老師、課程類別、課程學校、課程敘述、課程圖片存到 AWS ElasticSearch，並設定中文智慧最大分詞。<br>
<br>
However, it is necessary to pre-store the course name, course instructor, course category, course school, course description, and course image from SQL into AWS ElasticSearch, and configure Chinese intelligent maximum word segmentation.<br>


*分詞 Analyzer:<br>
中文最大分詞 (ik_max_word): "藝術文化生活" => "藝", "術", "文化生活", "文化", "化生", "生活"<br>
中文智慧分詞 (ik_smart): "藝術文化生活" => "藝", "術", "文化生活"<br>

<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/Save%20to%20ElasticSearch.png" alt="" width="50%"/></div>

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

*注意事項 Note
ES版本要在7.14以下(否則有些語法會不相容)<br>
The ES version needs to be below 7.14 (otherwise, some syntax may be incompatible).
  ```
  pip install 'elasticsearch<7.14.0'
  ```
___

### 寄提醒信 Sending Reminder Letter

<div align=center><img src="https://github.com/Blucas0707/ocw.notebook.taiwan/blob/main/Readme/flow/send%20reminder%20mail.png" alt="" width="80%"/></div>
AWS Event Bridge 每四天會觸發 lambda function，透過 lambda function從RDS MySQL 取得有訂閱的使用者信箱，並透過 AWS Simple Mail Service 寄出。<br>
AWS Event Bridge triggers a lambda function every four days, which retrieves subscribed user emails from RDS MySQL and sends them out using AWS Simple Mail Service.


