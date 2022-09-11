from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_script import Manager
from .exts import db, mail
from flask_migrate import Migrate
from flask_mail import Mail
from .blueprints import user_bp, admin_bp

app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)

# manager = Manager(app)
migrate = Migrate(app, db)
# manager.add_command('db', MigrateCommand)

mail.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(admin_bp)

from app import views, models
