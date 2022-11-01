from config import SQLALCHEMY_DATABASE_URI
from app.exts import db
from app import app

with app.app_context():
    db.create_all()