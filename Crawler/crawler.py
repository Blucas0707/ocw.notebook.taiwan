import threading
from crawler_NTU import NTU
from crawler_NTHU import NTHU
from crawler_NYTU import NYTU
# from Crawler_SQL import Crawler_SQL

#NTU / NTHU / NYTU NTU,NTHU,NYTU
UniversityObject = [NTU]
Threads = []

for index in range(len(UniversityObject)):
    Threads.append(threading.Thread(target = UniversityObject[index].CourseList))
    Threads[index].start()

# 等待所有子執行緒結束
for index in range(len(UniversityObject)):
    Threads[index].join()

# SQL delete & update
# Crawler_SQL.SQL_delete_CoursesandLectures()
# Crawler_SQL.Update_Courses()
