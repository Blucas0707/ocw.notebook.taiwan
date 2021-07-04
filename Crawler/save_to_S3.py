import requests
import os
import boto3
from dotenv import dotenv_values
config = dotenv_values("../.env")

class S3:
    def __init__(self):
        self.s3 = boto3.client('s3',
                  aws_access_key_id = config["AWS_ACCESS_KEY"],
                  aws_secret_access_key= config["AWS_SECRET_KEY"],
                 )
        self.BUCKET_NAME = config["S3_BUCKET_NAME"]
        self.cloudfront = config["AWS_CLOUDFRONT"]

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







#load .env config
# config = dotenv_values("../.env")
# print(config["S3_BUCKET_NAME"])
# s3 = boto3.client('s3',
#                   aws_access_key_id = config["AWS_ACCESS_KEY"],
#                   aws_secret_access_key= config["AWS_SECRET_KEY"],
#                  )
# BUCKET_NAME = config["S3_BUCKET_NAME"]
# cloudfront = config["AWS_CLOUDFRONT"]
# # web_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/files/110px/099S101.jpg"
# web_url = "http://140.112.161.118/dl_video.php?fn=099S103_AA01V01.mp4"
# myfile = requests.get(web_url)
#
# # my_file_name = web_url.split('/')[-1]
# my_file_name = web_url.split('=')[-1]
# print(my_file_name)
# with open(my_file_name,"wb") as my_file:
#     my_file.write(myfile.content)
#     my_file.close()
#
# # FOLDER_NAME = "course_cover/"
# FOLDER_NAME = "lecture_video/"
# try:
#     s3.upload_file(
#         Bucket=config["S3_BUCKET_NAME"],
#         Filename=my_file_name,
#         Key=FOLDER_NAME + my_file_name
#     )
#     print("Upload Done!")
#     try:
#         os.remove(my_file_name)
#         print("File deleted")
#     except:
#         print("File failed to delete")
# except:
#     print("Upload Fail!")
# print(cloudfront + FOLDER_NAME + my_file_name)