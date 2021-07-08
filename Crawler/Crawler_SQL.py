# -*- coding:utf-8 -*-
from save_to_S3 import S3
import mysql.connector
from mysql.connector import pooling
import threading
import datetime
from dotenv import dotenv_values
import json

#load .env config
config = dotenv_values(".env")
# RDS_DATABASES = json.loads(config["RDS_SQL_DATABASES"]) #轉成dictionary

class Crawler_SQLDB:
    def __init__(self):
        self.config = {
            "host":config["RDS_SQL_HOST"],
            "database":config["RDS_SQL_DATABASE"],
            "port":config["RDS_SQL_PORT"],
            "user":config["RDS_SQL_USER"],
            "password":config["RDS_SQL_PASSWORD"],
            "auth_plugin":"mysql_native_password"
        }
        # self.con = mysql.connector.connect(**self.config)
        self.pool = pooling.MySQLConnectionPool(pool_name = "Crawler",pool_size = 5,pool_reset_session=True,**self.config)
        # self.con = self.pool.get_connection()
        print("Crawler SQL 連線成功")

    def SQL_delete_CoursesandLectures(self):
        try:
            con = self.pool.get_connection()
            cursor = con.cursor()
            sql = """delete from courses; delete from lectures;"""
            cursor.execute(sql)
            con.commit()
            con.close()
            print("Delete courses & lectures done!")
        except:
            print("Delete courses & lectures Fail!")

    def test(self, para = None):
        con = self.pool.get_connection()
        cursor = con.cursor()
        # para = (course_id, course_university, course_semester, course_department, course_category, course_establish,
        #         course_name,course_cover, course_teacher, course_description, course_link)
        # ('台灣大學', '104', '農藝系', '生農醫衛', '2016-02', '咖啡學', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/104S207.jpg', '王裕文', '由於台灣並非咖啡的主要生產國，咖啡在台灣也非主要的經濟作物，但國人消費咖啡的習慣正逐年增加，因此咖啡課程在台灣的主要教授內容應著重在咖啡選購方面。本課程的主要目標將著重在咖啡品質的分辨與優缺點的判定。課程內容包括咖啡栽培管理與咖啡飲料的製作等項目，透過咖啡栽培管理的說明使同學了解咖啡各項特色及優缺點的成因。 咖啡品質的判定主要依賴官能鑑定，因此本課程特別強調官能鑑定的實作，務使同學經由咖啡實品的飲用比較，了解區分咖啡的各項特徵。咖啡官能鑑定的進度是以逐步建立咖啡官能鑑定程序來使學生了解各步驟的緣由與理論基礎，建立程序之後便開始利用來自各國各產區的咖啡樣品進行官能鑑定。 為使同學能有系統的認識咖啡的各種特色，除了利用各種咖啡樣品進行官能鑑定，對這些樣品的特色進行適當的描述也是必要的手段，但是每個人的形容詞各有不同，因此建立咖啡特色描述的形容詞彙是本課程的另一項重點。本課程準備了一套包含各種固體香料及液體香精油來做為各種形容詞彙的官能判定與討論的基礎。', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/104S207')
        new_para = tuple(list(para[:-2]))
        print(new_para)
        sql = """
                select count(*) from courses where course_university = %s
                and course_semester = %s
                and course_department = %s
                and course_category = %s
                and course_establish = %s
                and course_name = %s
                and course_cover = %s
                and course_teacher = %s;
                """
        cursor.execute(sql, new_para)
        result = cursor.fetchone()[0]
        print(result)
    def SQL_lecture_exist(self, para = None):
        # check if exists in SQL
        con = self.pool.get_connection()
        cursor = con.cursor()
        # para = (lecture_id, course_id, lecture_name, lecture_video, lecture_note, lecture_reference)
        sql = """
                select count(*) from lectures where lecture_id = %s
                """
        cursor.execute(sql, para)
        result = cursor.fetchone()[0]
        con.close()
        if result == 0: # not existed
            print("Lecture not existed")
            return False
        else:    #existed
            print("Lecture existed")
            return True

    def SQL_course_exist(self, para = None):
        #check if exists in SQL
        con = self.pool.get_connection()
        cursor = con.cursor()
        # para = (course_id, course_university, course_semester, course_department, course_category, course_establish,
        #         course_name,course_cover, course_teacher, course_description, course_link)
        #'台灣大學', '104', '農藝系', '生農醫衛', '2016-02', '咖啡學', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/104S207.jpg', '王裕文', '由於台灣並非咖啡的主要生產國，咖啡在台灣也非主要的經濟作物，但國人消費咖啡的習慣正逐年增加，因此咖啡課程在台灣的主要教授內容應著重在咖啡選購方面。本課程的主要目標將著重在咖啡品質的分辨與優缺點的判定。課程內容包括咖啡栽培管理與咖啡飲料的製作等項目，透過咖啡栽培管理的說明使同學了解咖啡各項特色及優缺點的成因。 咖啡品質的判定主要依賴官能鑑定，因此本課程特別強調官能鑑定的實作，務使同學經由咖啡實品的飲用比較，了解區分咖啡的各項特徵。咖啡官能鑑定的進度是以逐步建立咖啡官能鑑定程序來使學生了解各步驟的緣由與理論基礎，建立程序之後便開始利用來自各國各產區的咖啡樣品進行官能鑑定。 為使同學能有系統的認識咖啡的各種特色，除了利用各種咖啡樣品進行官能鑑定，對這些樣品的特色進行適當的描述也是必要的手段，但是每個人的形容詞各有不同，因此建立咖啡特色描述的形容詞彙是本課程的另一項重點。本課程準備了一套包含各種固體香料及液體香精油來做為各種形容詞彙的官能判定與討論的基礎。', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/104S207')
        new_para = tuple(list(para[1:-2]))
        sql = """
                select count(*) from courses where course_university = %s
                and course_semester = %s
                and course_department = %s
                and course_category = %s
                and course_establish = %s
                and course_name = %s
                and course_cover = %s
                and course_teacher = %s;
                """
        cursor.execute(sql, new_para)
        result = cursor.fetchone()[0]
        con.close()
        if result == 0: # not existed
            print("Course not existed")
            return False
        else:    #existed
            #取得最新的course_id
            con = self.pool.get_connection()
            cursor = con.cursor()
            sql = """
                            select course_id from courses where course_university = %s
                            and course_semester = %s
                            and course_department = %s
                            and course_category = %s
                            and course_establish = %s
                            and course_name = %s
                            and course_cover = %s
                            and course_teacher = %s
                            order by course_id DESC limit 1;
                            """
            cursor.execute(sql, new_para)
            result = cursor.fetchone()[0]
            print(f"Course existed, latest course_id: {result}")
            con.close()
            return result

    def SQL_get_last_course_id(self, para = None):
        # get the last course_id
        # select course_id from courses where course_university = '台灣大學' order by course_id DESC limit 1;
        con = self.pool.get_connection()
        cursor = con.cursor()
        sql = """select course_id from courses where course_university = %s order by course_id DESC limit 1;"""
        new_para = (para[1],)
        print(new_para)
        cursor.execute(sql, new_para)
        print(cursor.fetchone())
        if cursor.fetchone() == None: #first in SQL
            course_id = para[0]
            last_course_id = course_id
        else:
            last_course_id  = int(cursor.fetchone()[0]) + 1
        print(f"last_course_id: {last_course_id}")
        con.close()
        new_para = list(para[1:])
        new_para.insert(0,last_course_id) #update course_id
        return new_para

    def SQL_update_course_list(self, para = None):
        try:
            con = self.pool.get_connection()
            cursor = con.cursor()
            #get the last course_id
            # select course_id from courses where course_university = '台灣大學' order by course_id DESC limit 1;
            # sql = """select course_id from courses where course_university = %s order by course_id DESC limit 1;"""
            # new_para = ((para[0]),)
            # cursor.execute(sql, new_para)
            # last_course_id = int(cursor.fetchone()[0]) + 1

            #upload to SQL
            sql = """
                    insert into courses (course_id,course_university,course_semester,course_department,course_category,course_establish,
                    course_name,course_cover,course_teacher,course_description,course_link)
                    values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """
            # new_para = list(para[1:])
            # new_para.insert(0,last_course_id) #update course_id
            cursor.execute(sql, para)
            con.commit()
            con.close()
            print(f"Save course: {para[6]} to SQL.")
            return True
        except:
            print(para)
            print(f"Fail to save course: {para[6]} to SQL.")
            return False


    def SQL_update_lectures(self, para = None):
        try:
            #upload to SQL
            con = self.pool.get_connection()
            cursor = con.cursor()
            sql = """
                    insert into lectures (lecture_id, course_id, lecture_name, 
                    lecture_video, lecture_note, lecture_reference)
                    values (%s,%s,%s,%s,%s,%s)
                    """
            cursor.execute(sql, para)
            con.commit()
            con.close()
            print(f"Save lecture: {para[:3]} to SQL.")
            return True
        except:
            # print(para)
            print(f"Fail to save lecture: {para[:3]} to SQL lectures.")
            return False

    def Update_Courses(self,para = None):
        OCW_UNIVERSITY_LIST = json.loads(config["OCW_UNIVERSITY_LIST"])["OCW_UNIVERSITY_LIST"]
        print(OCW_UNIVERSITY_LIST)
        Threads = []
        for OCW_UNIVERSITY in OCW_UNIVERSITY_LIST:
            startTime = datetime.datetime.now()

            filename = OCW_UNIVERSITY + ".json"
            print(filename)
            t = threading.Thread(target = self.update_sql_course, args = (filename,))
            t.start()


    def update_sql_course(self, filename):
        startTime = datetime.datetime.now()
        with open(filename, "r") as f:
            jsonformat = json.loads(f.read())

        # print(jsonformat["university"])
        total_course_number = jsonformat["total_course"]
        total_courses = jsonformat["course"]
        for course_index in range(total_course_number):
            course_info = total_courses[course_index]

            if jsonformat["university"] == "台灣大學":
                university_ip = "112"
            elif jsonformat["university"] == "清華大學":
                university_ip = "114"
            elif jsonformat["university"] == "陽明交通大學":
                university_ip = "113"
            course_id = university_ip + str(course_index + 1).zfill(3)
            course_university = jsonformat["university"]
            course_semester = course_info["course_semester"]
            course_department = course_info["course_department"]
            course_category = course_info["course_category"]
            course_establish = course_info["course_establish"]
            course_name = course_info["course_name"]
            # NTU need to upload to S3
            if "NTU" in filename:
                web_upload_url = course_info["course_cover"]
                course_cover = S3.upload(web_upload_url)
            else:
                course_cover = course_info["course_cover"]
            course_teacher = course_info["course_teacher"]
            course_description = course_info["course_description"]
            course_link = course_info["course_link"]

            #save to SQL courses
            para = (course_id, course_university, course_semester, course_department,course_category, course_establish, course_name,
                    course_cover, course_teacher, course_description, course_link)
            print(f"Coures: {para[:7]}")

            course_lecture = course_info["course_lecture"]
            if course_lecture["lecture_total"] in ["", 0]:  # lecture no video exist
                lecture_total = 0
                # 沒有相關影音 不存入SQL
                print("沒有相關影音 不存入SQL")
            else:
                #check course existed in SQL
                courseisExisted = self.SQL_course_exist(para) #False = not existed, latest course_id = existed
                if courseisExisted != False:
                    #check course if totally repeated
                    # get last course_id => new_para
                    print(f"course_id: {course_id}, courseisExisted: {courseisExisted}")
                    if int(course_id) >= int(courseisExisted):
                        pass
                    else:
                        #check lecture list
                        # lectures
                        course_lecture = course_info["course_lecture"]
                        if course_lecture["lecture_total"] in ["",0]:  # lecture no video exist
                            lecture_total = 0
                            #沒有相關影音 不存入SQL
                            print("沒有相關影音 不存入SQL")

                        else:
                            lecture_total = int(course_lecture["lecture_total"])
                            lecture_infos = course_lecture["lecture"]
                            # print(course_lecture,"\n", lecture_total)

                            for lecture_index in range(lecture_total):
                                lecture_info = lecture_infos[lecture_index]
                                # print(f"lecture_info: {lecture_info} , {lecture_index}")
                                lecture_id = course_id + str(lecture_info["lecture_id"]).zfill(3)
                                lecture_name = lecture_info["lecture_name"]

                                # lecture_videos: []
                                lecture_videos = lecture_info["lecture_video"]
                                lecture_video = ""
                                if len(lecture_videos) == 0:
                                    lecture_video = ""
                                elif len(lecture_videos) == 1:
                                    # NTU need to upload to S3
                                    if "NTU" in filename:
                                        web_upload_url = lecture_videos[0]
                                        lecture_video = S3.upload(web_upload_url)
                                    else:
                                        lecture_video = lecture_videos[0]

                                # lecture_notes: []
                                lecture_notes = lecture_info["lecture_note"]
                                lecture_note = ""
                                if len(lecture_notes) == 0:
                                    lecture_note = ""
                                elif len(lecture_notes) == 1:
                                    # NTU need to upload to S3
                                    if "NTU" in filename:
                                        web_upload_url = lecture_notes[0]
                                        lecture_note = S3.upload(web_upload_url)
                                    else:
                                        lecture_note = lecture_notes[0]
                                elif len(lecture_notes) > 1:
                                    for note_index in range(len(lecture_notes)):
                                        # NTU need to upload to S3
                                        if "NTU" in filename:
                                            web_upload_url = lecture_notes[note_index]
                                            temp_lecture_note = S3.upload(web_upload_url)
                                            lecture_note += (temp_lecture_note + "||")
                                        else:
                                            lecture_note += (lecture_notes[note_index] + "||")


                                # lecture_references: []
                                lecture_references = lecture_info["lecture_reference"]
                                lecture_reference = ""
                                if len(lecture_references) == 0:
                                    lecture_reference = ""
                                elif len(lecture_references) == 1:
                                    #NTU need to upload to S3
                                    if "NTU" in filename:
                                        web_upload_url = lecture_references[0]
                                        lecture_reference = S3.upload(web_upload_url)
                                    else:
                                        lecture_reference = lecture_references[0]
                                elif len(lecture_references) > 1:
                                    for reference_index in range(len(lecture_references)):
                                        # NTU need to upload to S3
                                        if "NTU" in filename:
                                            web_upload_url = lecture_references[reference_index]
                                            temp_lecture_reference = S3.upload(web_upload_url)
                                            lecture_reference += (temp_lecture_reference + "||")
                                        else:
                                            lecture_reference += (lecture_references[reference_index] + "||")

                                # save to SQL lectures
                                para = (lecture_id, course_id, lecture_name, lecture_video, lecture_note, lecture_reference)
                                print(f"Lecture: {para[:3]}")
                                #check lecture is existed
                                lectureisExisted = self.SQL_lecture_exist((para[0],)) #search lecture_id
                                if lectureisExisted:
                                    pass
                                else:
                                    lectures_update_status = self.SQL_update_lectures(para=para)
                                    if not lectures_update_status:
                                        return
                else:
                    #get last course_id => new_para
                    new_para = self.SQL_get_last_course_id(para)
                    courses_update_status = self.SQL_update_course_list(para=new_para)
                    if not courses_update_status:
                        return

                    # lectures
                    course_lecture = course_info["course_lecture"]
                    if course_lecture["lecture_total"] in ["",0]:  # lecture no video exist
                        lecture_total = 0
                        # 沒有相關影音 不存入SQL
                        print("沒有相關影音 不存入SQL")

                    else:
                        lecture_total = int(course_lecture["lecture_total"])
                        lecture_infos = course_lecture["lecture"]
                        # print(course_lecture,"\n", lecture_total)

                        for lecture_index in range(lecture_total):
                            lecture_info = lecture_infos[lecture_index]
                            # print(f"lecture_info: {lecture_info} , {lecture_index}")
                            lecture_id = str(course_id) + str(lecture_info["lecture_id"]).zfill(3)
                            lecture_name = lecture_info["lecture_name"]

                            # lecture_videos: []
                            lecture_videos = lecture_info["lecture_video"]
                            lecture_video = ""
                            if len(lecture_videos) == 0:
                                lecture_video = ""
                            elif len(lecture_videos) == 1:
                                # NTU need to upload to S3
                                if "NTU" in filename:
                                    web_upload_url = lecture_videos[0]
                                    lecture_video = S3.upload(web_upload_url)
                                else:
                                    lecture_video = lecture_videos[0]

                            # lecture_notes: []
                            lecture_notes = lecture_info["lecture_note"]
                            lecture_note = ""
                            if len(lecture_notes) == 0:
                                lecture_note = ""
                            elif len(lecture_notes) == 1:
                                # NTU need to upload to S3
                                if "NTU" in filename:
                                    web_upload_url = lecture_notes[0]
                                    lecture_note = S3.upload(web_upload_url)
                                else:
                                    lecture_note = lecture_notes[0]
                            elif len(lecture_notes) > 1:
                                for note_index in range(len(lecture_notes)):
                                    # NTU need to upload to S3
                                    if "NTU" in filename:
                                        web_upload_url = lecture_notes[note_index]
                                        temp_lecture_note = S3.upload(web_upload_url)
                                        lecture_note += (temp_lecture_note + "||")
                                    else:
                                        lecture_note += (lecture_notes[note_index] + "||")

                            # lecture_references: []
                            lecture_references = lecture_info["lecture_reference"]
                            lecture_reference = ""
                            if len(lecture_references) == 0:
                                lecture_reference = ""
                            elif len(lecture_references) == 1:
                                # NTU need to upload to S3
                                if "NTU" in filename:
                                    web_upload_url = lecture_references[0]
                                    lecture_reference = S3.upload(web_upload_url)
                                else:
                                    lecture_reference = lecture_references[0]
                            elif len(lecture_references) > 1:
                                for reference_index in range(len(lecture_references)):
                                    # NTU need to upload to S3
                                    if "NTU" in filename:
                                        web_upload_url = lecture_references[reference_index]
                                        temp_lecture_reference = S3.upload(web_upload_url)
                                        lecture_reference += (temp_lecture_reference + "||")
                                    else:
                                        lecture_reference += (lecture_references[reference_index] + "||")

                            # save to SQL lectures
                            course_id = new_para[0]
                            para = (lecture_id, course_id, lecture_name, lecture_video, lecture_note, lecture_reference)
                            # print(para)
                            lectures_update_status = self.SQL_update_lectures(para=para)

                            if not lectures_update_status:
                                return
                # test
                # break





        endTime = datetime.datetime.now()
        Duration = endTime - startTime
        print(f"""{jsonformat["university"]}, Duration: {Duration}""")

        # write in log
        file_path = ""
        file = file_path + "log.txt"
        with open(file, "a+") as log:
            exec_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            message = f""" [SQL][{jsonformat["university"]}] and duration = {Duration}""" + "\n"
            log.seek(0)
            existing_content = log.read()
            log.write(exec_time + message + existing_content)
            log.close()


Crawler_SQL = Crawler_SQLDB()
Crawler_SQL.Update_Courses()
# para = ('台灣大學', '104', '農藝系', '生農醫衛', '2016-02', '咖啡學', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/104S207.jpg', '王裕文', '由於台灣並非咖啡的主要生產國，咖啡在台灣也非主要的經濟作物，但國人消費咖啡的習慣正逐年增加，因此咖啡課程在台灣的主要教授內容應著重在咖啡選購方面。本課程的主要目標將著重在咖啡品質的分辨與優缺點的判定。課程內容包括咖啡栽培管理與咖啡飲料的製作等項目，透過咖啡栽培管理的說明使同學了解咖啡各項特色及優缺點的成因。 咖啡品質的判定主要依賴官能鑑定，因此本課程特別強調官能鑑定的實作，務使同學經由咖啡實品的飲用比較，了解區分咖啡的各項特徵。咖啡官能鑑定的進度是以逐步建立咖啡官能鑑定程序來使學生了解各步驟的緣由與理論基礎，建立程序之後便開始利用來自各國各產區的咖啡樣品進行官能鑑定。 為使同學能有系統的認識咖啡的各種特色，除了利用各種咖啡樣品進行官能鑑定，對這些樣品的特色進行適當的描述也是必要的手段，但是每個人的形容詞各有不同，因此建立咖啡特色描述的形容詞彙是本課程的另一項重點。本課程準備了一套包含各種固體香料及液體香精油來做為各種形容詞彙的官能判定與討論的基礎。', 'http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/104S207')
# Crawler_SQL.test(para)





