import requests
import os
import boto3
from dotenv import dotenv_values
import mysql.connector
from mysql.connector import pooling
config = dotenv_values("../.env")

class SQL_check:
    def __init__(self):
        self.config = {
            "host":config["RDS_SQL_HOST"],
            "database":"Course",
            "port":config["RDS_SQL_PORT"],
            "user":config["RDS_SQL_USER"],
            "password":config["RDS_SQL_PASSWORD"],
            "auth_plugin":"mysql_native_password"
        }
        # self.con = mysql.connector.connect(**self.config)
        self.pool = pooling.MySQLConnectionPool(pool_name = "Crawler",pool_size = 1,pool_reset_session=True,**self.config)
        # self.con = self.pool.get_connection()
        print("Crawler SQL 連線成功")

    def check_s3_existed(self, url):
        con = self.pool.get_connection()
        cursor = con.cursor()
        sql = """select count(*) from lectures where lecture_video = %s"""
        para = (url,)
        cursor.execute(sql,para)
        result = cursor.fetchone()[0]
        con.close()
        print(result)
        if result == 0:
            return False
        else:
            return True




class S3(SQL_check):
    def __init__(self):
        self.s3 = boto3.client('s3',
                  aws_access_key_id = config["AWS_ACCESS_KEY"],
                  aws_secret_access_key= config["AWS_SECRET_KEY"],
                 )
        self.BUCKET_NAME = config["S3_BUCKET_NAME"]
        self.cloudfront = config["AWS_CLOUDFRONT"]
        SQL_check.__init__(self)

    def upload(self, web_url = None):
        print(f"start downloading: {web_url}")
        myfile = requests.get(web_url)

        if web_url.split(".")[-1] == "mp4":
            # web_url = "http://140.112.161.118/dl_video.php?fn=099S103_AA01V01.mp4"
            my_file_name = web_url.split('=')[-1]
            FOLDER_NAME = "lecture_video/"
        elif web_url.split(".")[-1] == "jpg":
            # web_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/099S101.jpg" or ".ppt"
            my_file_name = web_url.split('/')[-1]
            FOLDER_NAME = "course_cover/"
        else :
            # web_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/099S101.ppt" or pdf
            my_file_name = web_url.split('/')[-1]
            FOLDER_NAME = "course_note/"

        #check if in SQL
        s3_url = self.cloudfront + FOLDER_NAME + my_file_name
        if super().check_s3_existed(s3_url):
            print("lecture existed")
            return
        else:
            #save file
            print("start saving to local")
            with open(my_file_name, "wb") as my_file:
                my_file.write(myfile.content)
                my_file.close()

            #upload to S3
            print("start uploading to s3")
            try:
                self.s3.upload_file(
                    Bucket=self.BUCKET_NAME,
                    Filename=my_file_name,
                    Key=FOLDER_NAME + my_file_name
                )
                print("Upload Done!")
                try:
                    os.remove(my_file_name)
                    print("File deleted")
                except:
                    print("File failed to delete")
            except:
                print("Upload Fail!")
            s3_url = self.cloudfront + FOLDER_NAME + my_file_name
            print(s3_url)
            return s3_url

S3 = S3()
# web_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/099S101.jpg"
# S3.upload(web_url)
