from app import db

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), index=True, unique=True)
    password = db.Column(db.String(20))
    admin = db.Column(db.Boolean, default=False)
    register_datetime = db.Column(db.DateTime)
    last_login_datetime = db.Column(db.DateTime)

    def __repr__(self) -> str:
        return '<User % r>' % (self.id, self.username, self.admin)


class TodoListModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True)
    list_name = db.Column(db.String(20), index=True, unique=True)
    limit = db.Column(db.Integer)
    properties = db.relationship('Property', backref='todo_list', lazy='dynamic')

    def __repr__(self) -> str:
        return '<TodoList % r>' % (self.id, self.user_id, self.list_name)


class EventModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    todo_list_id = db.Column(db.Integer, db.ForeignKey('todo_list.id'), unique=True)
    title = db.Column(db.String(20), index=True)
    content = db.Column(db.Text(100))
    create_datetime = db.Column(db.DateTime)
    setting_datetime = db.Column(db.DateTime)
    finished = db.Column(db.Boolean, default=False)
    finished_datetime = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return '<Event % r>' % (self.id, self.todo_list_id, self.title, self.content, self.setting_time, self.finished)