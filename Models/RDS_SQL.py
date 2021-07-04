import mysql.connector
from mysql.connector import pooling
from dotenv import dotenv_values
import json

#load .env config
config = dotenv_values("../../key/.env")
RDS_DATABASES = json.loads(config["RDS_SQL_DATABASES"]) #轉成dictionary
class RDS_SQLDB:
    def __init__(self):
        self.config = {
            "host":config["RDS_SQL_HOST"],
            "database":config["RDS_SQL_DATABASE"],
            "port":config["RDS_SQL_PORT"],
            "user":config["RDS_SQL_USER"],
            "password":config["RDS_SQL_PASSWORD"],
            "auth_plugin":"mysql_native_password"
        }
        self.pool = pooling.MySQLConnectionPool(pool_name = "mypool",pool_size = 8,pool_reset_session=True,**self.config)
        # self.conn = self.pool.get_connection()
        print("RDS POOL連線成功")

    def update_course_list(self, para = None):
        #judge id include invalid character
        try:
            #upload to SQL
            con = self.pool.get_connection()
            cursor = con.cursor()
            sql = """insert into courses (commet,)
                    values (%s,%s)"""
            cursor.execute(sql, para)
            con.commit()
            #close sql connect
            self.close(cursor,con)

            #get latest data
            con = self.pool.get_connection()
            cursor = con.cursor()
            sql = """select * from record order by id DESC limit 1"""
            cursor.execute(sql)
            result = cursor.fetchone()
            print(f"result = {result}")
            # close sql connect
            self.close(cursor, con)
            return result

        except:
            return "False"

    def getData(self,para = None):
        try:
            sql = """select * from record order by id DESC"""
            con = self.pool.get_connection()
            cursor = con.cursor()
            cursor.execute(sql, para)
            results = cursor.fetchall()
            # close sql connect
            self.close(cursor, con)
            data_dict ={
                "total":len(results),
                "content":[]
            }
            for result in results:
                text = result[1]
                img_link = result[2]
                data = {
                    "text":text,
                    "img_link":img_link
                }
                data_dict["content"].append(data)

            print(data_dict)
            return data_dict



        except:
            return 500

RDS = RDS_SQLDB()





