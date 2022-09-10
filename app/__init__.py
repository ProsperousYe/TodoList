from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from flask_script import Manager
from flask_migrate import Migrate
from flask_mail import Mail

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# manager = Manager(app)
migrate = Migrate(app, db)
# manager.add_command('db', MigrateCommand)

mail = Mail(app)

from app import views, models
