import os
from posixpath import dirname
basedir = os.path.abspath(os.path.dirname(__file__))
# database config
HOSTNAME = '127.0.0.1'
PORT = '3306'
DATABASE = 'mysql'
USERNAME = 'root'
PASSWORD = 'Yxk20021205'
DB_URI = 'mysql+pymysql://{}:{}@{}:{}/{}?charset=utf8'.format(USERNAME,PASSWORD,HOSTNAME,PORT,DATABASE)
SQLALCHEMY_DATABASE_URI = DB_URI
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'app.db')
SQLALCHEMY_TRACK_MODIFICATIONS = True

WTF_CSRF_ENABLED = True
SECRET_KEY = 'a-very-secret-secret'