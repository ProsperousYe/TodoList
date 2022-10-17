import random
from datetime import datetime
from this import s
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from flask_mail import Message
from app.blueprints.admin import show_all_user
from app.blueprints.forms import EventForm, TodoListForm
import string
from app import db, mail
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import EmailCaptchaModel, UserModel, EventModel, TodoListModel

# 注册了一个bp，名字叫event，前置路径是/event
bp = Blueprint("event", __name__, url_prefix="/event")

@bp.route('/add_event', methods=['POST', 'GET'])
def add_event():
    if request.method == 'GET':
        return render_template('add_event.html')
    else:
        id = session.get('id')
        print(id)
        form = EventForm(request.form)
        if form.validate():
            title = form.title.data
            content = form.content.data
            setting_datetime = request.values.get("setting_datetime")
            user = UserModel.query.filter(id == id).first()
            if user:
                event = EventModel(
                    title=title, content=content, setting_datetime=setting_datetime,
                    create_datetime=datetime.now()
                )
                db.session.add(event)
                db.session.commit()
                return redirect(url_for("index", username=user.username, id=user.id))
            else:
                return jsonify(code=400, message = "Invalid user")
        else:
            return jsonify(code=400, message = "Invalid form")

@bp.route('load_event', methods=['GET'])
def load_event():
    id = session.get('id')
    print(id)
    user = UserModel.query.filter(id == id).first()
    events = EventModel.query.all()
    return jsonify({'code': 200, 'events': [events]})

@bp.route('/add_todolist', methods=['POST', 'GET'])
def add_todolist():
    if request.method == 'GET':
        return render_template('add_todolist.html')
    else:
        id = session.get('id')
        print(id)
        form = TodoListForm(request.form)
        if form.validate():
            list_name = form.list_name.data
            user = UserModel.query.filter(id == id).first()
            if user:
                todo_list = TodoListModel(
                    user_id = id, list_name=list_name, limit=20
                )
                db.session.add(todo_list)
                db.session.commit()
                return redirect(url_for("index", username=user.username, id=user.id))
            else:
                return jsonify(code=400, message = "Invalid user")
        else:
            return jsonify(code=400, message = "Invalid form")

@bp.route('load_todolist', methods=['POST'])
def load_todolist():
    id = session.get('id')
    print(id)
    user = UserModel.query.filter(id == id).first()
    todoLists = TodoListModel.query.all()
    return jsonify({'code': 200, 'todo_lists': [todoLists]})