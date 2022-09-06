from app import db

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), index=True, unique=True)
    password = db.Column(db.String(20), password=True)
    admin = db.Column(db.Boolean, default=False)
    rigister_date = db.Column(db.DateTime)
    last_login_time = db.Column(db.DateTime)

