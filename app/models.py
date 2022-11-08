from .exts import db
from datetime import datetime

class UserModel(db.Model):
    '''用户表'''
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(200), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    admin = db.Column(db.Boolean, default=False)
    register_datetime = db.Column(db.DateTime, default=datetime.now)
    state = db.Column(db.Boolean, default=False)
    todo_list = db.relationship('TodoListModel', backref='user', uselist=True)

class EmailCaptchaModel(db.Model):
    __tablename__ = "email_captcha"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    captcha = db.Column(db.String(10), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now)

class TodoListModel(db.Model):
    '''事项列表 表'''
    __tablename__ = "todo_list"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    list_name = db.Column(db.String(20),unique=False)
    limit = db.Column(db.Integer)
    events = db.relationship('EventModel', backref='todo_list', uselist=True)

class EventModel(db.Model):
    '''事项表'''
    __tablename__ = "event"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    todo_list_id = db.Column(db.Integer, db.ForeignKey('todo_list.id'))
    title = db.Column(db.String(20))
    content = db.Column(db.Text(100))
    label = db.Column(db.Integer)
    create_datetime = db.Column(db.DateTime)
    setting_year = db.Column(db.Integer)
    setting_month = db.Column(db.Integer)
    setting_date = db.Column(db.Integer)
    setting_time = db.Column(db.Time)
    duration = db.Column(db.Integer)
    gone_days = db.Column(db.Integer)
    finished = db.Column(db.Boolean, default=False)
    finished_datetime = db.Column(db.DateTime, nullable=True)

class Tasks(db.Model):
    '''任务表'''
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    task_name = db.Column(db.String(100))
    finished = db.Column(db.Boolean, default=False)

