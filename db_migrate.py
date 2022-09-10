
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from app import app, db
 
manager = Manager(app)
 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:Mysql!123@127.0.0.1:3306/MyDB_two'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'NFAIOSDFHASOGHAOSPIGAOWE'
db = SQLAlchemy(app)
 
migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)

 
 
if __name__ == '__main__':
    # user_one = User(name='You')
    # db.session.add(user_one)
    # computer_one = Computer(name='Dell', user_id=1)
    # db.session.add(computer_one)
    # db.session.commit()

    manager.run()