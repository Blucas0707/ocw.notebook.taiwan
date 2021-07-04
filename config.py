from flask import *
import os
from datetime import timedelta
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

#session
app.config['SECRET_KEY'] = os.urandom(24) #用os 隨機生成24位密鑰
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days = 30) #過期為30天