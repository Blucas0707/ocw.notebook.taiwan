import requests
import os
import boto3
from dotenv import dotenv_values
from mysql.connector import pooling
config = dotenv_values("../.env")

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
        self.pool = pooling.MySQLConnectionPool(pool_name = "Crawler",pool_size = 1,pool_reset_session=True,**self.config)
        # self.con = self.pool.get_connection()
        print("Sitemap SQL 連線成功")

    def getCourseId(self):
        con = self.pool.get_connection()
        cursor = con.cursor()
        sql = """select course_id from courses"""
        # para = (url,)
        cursor.execute(sql)
        results = cursor.fetchall()
        con.close()
        return results

def make_sitemap():
    results = SQL().getCourseId()
    with open("sitemap.xml", "a+") as sitemap:
        for result in results:
            course_id = str(result[0])
            content = "  <url>\n" + "    <loc>https://ocw.notebook.blucas0707.com/course/"+ course_id +"</loc>\n" + "  </url>\n"
            sitemap.write(content)
        content = "\n</urlset>"
        sitemap.write(content)
        print("append done")
    sitemap.close()

make_sitemap()


