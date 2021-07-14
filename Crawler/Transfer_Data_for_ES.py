from AWS_ElasticSearch import es
from mysql.connector import pooling
from dotenv import dotenv_values
import json

#load .env config
config = dotenv_values(".env")

class SQL:
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
        self.pool = pooling.MySQLConnectionPool(pool_name = "ForES",pool_size = 2,pool_reset_session=True,**self.config)
        # self.con = self.pool.get_connection()
        print("ES SQL 連線成功")

    def getData(self):
        con = self.pool.get_connection()
        cursor = con.cursor()
        sql = """select course_id,course_name,course_teacher,course_university,course_category,course_description,course_cover from Course.courses order by course_establish ASC;"""
        cursor.execute(sql)
        results = cursor.fetchall()
        self.save_into_ES(results) #save into ES
        # print(results[0])

    def save_into_ES(self, data):
        for i in range(len(data)):
            content_dic = {
                "course_name":"",
                "course_teacher": "",
                "course_university": "",
                "course_category": "",
                "course_description": "",
                "course_cover": "",
            }
            id = data[i][0] #course_id
            content_dic["course_name"] = data[i][1] #course_name
            content_dic["course_teacher"] = data[i][2]  # course_teacher
            content_dic["course_university"] = data[i][3]  # course_university
            content_dic["course_category"] = data[i][4]  # course_category
            content_dic["course_description"] = data[i][5]  # course_description
            content_dic["course_cover"] = data[i][6]  # course_cover
            es.index(index="courses",body = content_dic, id=id)

        print("Save done!")


ES = SQL()
ES.getData()

# {
#   "mappings": {
#       "properties": {
#         "course_name": {
#           "type": "text",
#           "analyzer": "ik_max_word",
#           "search_analyzer": "ik_max_word"
#         },
#         "course_teacher": {
#           "type": "text",
#           "analyzer": "ik_max_word",
#           "search_analyzer": "ik_max_word"
#         },
#         "course_category": {
#           "type": "text",
#           "analyzer": "ik_max_word",
#           "search_analyzer": "ik_max_word"
#         },
#         "course_university": {
#           "type": "text",
#           "analyzer": "ik_max_word",
#           "search_analyzer": "ik_max_word"
#         },
# 	    "course_description": {
#           "type": "text",
#           "analyzer": "ik_max_word",
#           "search_analyzer": "ik_max_word"
#         },
#         "course_cover": {
#           "type": "text",
#         }
#       }
#   }
# }