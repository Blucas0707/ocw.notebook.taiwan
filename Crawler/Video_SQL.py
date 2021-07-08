# -*- coding:utf-8 -*-
# from save_to_S3 import S3
import mysql.connector
from mysql.connector import pooling
import threading
import datetime
from dotenv import dotenv_values
import json
import cv2
from moviepy.editor import VideoFileClip

#load .env config
config = dotenv_values(".env")
# RDS_DATABASES = json.loads(config["RDS_SQL_DATABASES"]) #轉成dictionary

class Video_SQLDB:
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
        self.lecture_results = ""
        # self.con = self.pool.get_connection()
        print("Video SQL 連線成功")

    def getLectures(self):
        con = self.pool.get_connection()
        cursor = con.cursor()
        sql = """select lecture_id, lecture_video, lecture_duration from lectures where lecture_video != "" and lecture_duration IS NULL or lecture_duration = 0;"""
        cursor.execute(sql)
        self.lecture_results = cursor.fetchall()
        con.close()
        print(len(self.lecture_results))
        print("done!")

    def CalVideoDuration(self):
        self.getLectures()
        index = 0
        for lecture_result in self.lecture_results:
            index += 1
            print(f"{index} / {len(self.lecture_results)}")
            lecture_id = lecture_result[0]
            lecture_link = lecture_result[1]
            lecture_duration = lecture_result[2]
            # print(lecture_id, lecture_link, lecture_duration)
            if lecture_duration == None or lecture_duration == 0:
                cal_lecture_duration = self.getVideoDuration_cv2(lecture_link)
                print(lecture_id,lecture_link,cal_lecture_duration)
                para = (cal_lecture_duration,lecture_id)
                self.updateLecture(para)
    #
    # t = threading.Thread(target=self.update_sql_course, args=(filename,))
    # t.start()

    def CalandUpdate(self,lecture_id, lecture_duration, lecture_link):
        if lecture_duration == None:
            cal_lecture_duration = self.getVideoDuration(lecture_link)
            # print(lecture_id, lecture_link, cal_lecture_duration)
            para = (cal_lecture_duration, lecture_id)
            self.updateLecture(para)

    def updateLecture(self,para=None):
        sql = """ update lectures set lecture_duration = %s where lecture_id = %s"""
        con = self.pool.get_connection()
        cursor = con.cursor()
        cursor.execute(sql,para)
        con.commit()
        con.close()
        print("update done!")



    def getVideoDuration_moviepy(self,filename):
        try:
            clip = VideoFileClip(filename)
            duration = clip.duration
        except:
            duration = 0
        print(duration)
        return duration

    def getVideoDuration_cv2(self,filename):
        try:
            video = cv2.VideoCapture(filename)
            frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)
            frame_rate = video.get(cv2.CAP_PROP_FPS)
            duration = frame_count / frame_rate
        except:
            duration = 0
        # print(duration)
        return duration



Video_SQL = Video_SQLDB()
Video_SQL.CalVideoDuration()

# filename = "https://df3f2abycnq4b.cloudfront.net/lecture_video/099S101_GE01V01.mp4"
# clip = VideoFileClip(filename)
# duration = clip.duration
# print(duration)





