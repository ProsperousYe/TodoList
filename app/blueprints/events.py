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
        user_id = session.get('id')
        user=UserModel.query.filter(UserModel.id==user_id).first()
        # print(user_id)
        id = request.values.get("list_id")
        form = EventForm(request.form)
        if form.validate():
            title = form.event_name.data
            content = form.event_description.data
            setting_date_all = request.values.get("event_finish_date")
            setting_day = setting_date_all.split('-')
            setting_year , setting_month , setting_date = setting_day
            setting_time = request.values.get("event_finish_time")
            # print(setting_year, setting_month, setting_date)
            label = request.values.get("label")
            # print(setting_time, type(setting_time))
            setting_time = datetime.strptime(setting_time, "%H:%M").time()
            duration = (datetime.strptime(setting_date_all, "%Y-%m-%d")-datetime.now()).days + 1
            todo_list = TodoListModel.query.filter(TodoListModel.id==id).first()
            # print(label, duration)
            if todo_list:
                event = EventModel(
                    gone_days = 0,
                    user_id = user_id,
                    title=title,
                    content=content,
                    setting_year=setting_year,
                    setting_month=setting_month,
                    setting_date=setting_date,
                    setting_time=setting_time,
                    todo_list_id=id,
                    label=label,
                    create_datetime=datetime.now(),
                    duration = duration
                )
                db.session.add(event)
                db.session.commit()
                return redirect(url_for("index", username=user.username, id=user.id))
            else:
                return jsonify(code=400, message = "Invalid user")
        else:
            return jsonify(code=400, message = "Invalid form")

@bp.route('/load_event', methods=['POST'])
def load_event():
    user_id = session.get('id')
    user = UserModel.query.filter(UserModel.id==user_id).first()
    list_id = request.values.get("list_id")
    # print("list id:",list_id)
    com = '0'
    events = EventModel.query.filter(EventModel.todo_list_id==list_id and EventModel.finished==com).order_by("duration").all()
    for event in events:
        event.gone_days = (datetime.now()-event.create_datetime).days
    try:
        db.session.commit()
        return jsonify({'code':200, 'message':render_template('show_event.html',user=user, events=events, list_id = 0, com = com)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'code':400, 'message' :str(e)})

@bp.route('/load_event_label', methods=['POST'])
def load_event_label():
    user_id = session.get('id')
    user = UserModel.query.filter(UserModel.id==user_id).first()
    label = request.values.get("label")
    com = '0'
    u_events = EventModel.query.filter(EventModel.user_id==user_id)
    events = u_events.filter(EventModel.label==label, EventModel.finished==com).all()
    for event in events:
        event.gone_days = (datetime.now()-event.create_datetime).days
    try:
        db.session.commit()
        return jsonify({'code':200, 'message':render_template('show_event.html',user=user, events=events, list_id = 0, com = com)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'code':400, 'message' :str(e)})

@bp.route('/completed', methods=['POST'])
def completed():
    user_id = session.get('id')
    user = UserModel.query.filter(UserModel.id==user_id).first()
    com = request.values.get('com')
    user_e = EventModel.query.filter(EventModel.user_id==user.id)
    events = user_e.filter(EventModel.finished==com)
    for event in events:
        event.gone_days = (datetime.now()-event.create_datetime).days
    try:
        db.session.commit()
        return jsonify({'code':200, 'message':render_template('show_event.html',user=user, events=events, list_id = 0, com = com)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'code':400, 'message' :str(e)})

@bp.route('/add_todolist', methods=['POST', 'GET'])
def add_todolist():
    if request.method == 'GET':
        return render_template('add_todolist.html')
    else:
        id = session.get('id')
        form = TodoListForm(request.form)
        if form.validate():
            list_name = form.todo_list_name.data
            user = UserModel.query.filter(UserModel.id == id).first()
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

@bp.route('/load_todolist', methods=['GET'])
def load_todolist():
    id = session.get('id')
    user = UserModel.query.filter(id == id).first()
    print(id)
    todoLists = TodoListModel.query.filter(TodoListModel.user_id==id).all()
    lists = []
    for todoList in todoLists:
        lists.append({
            'id': todoList.id,
            'list_name': todoList.list_name,
        })
    return jsonify(code=200, message = lists)

@bp.route('/finished_event', methods=['POST'])
def finished_event():
    id = request.values.get('id')
    event = EventModel.query.filter(EventModel.id == id).first()
    list_id = event.todo_list_id
    if event:
        event.finished = True
        db.session.commit()
        return jsonify({"code": 200, "message": "Event finished!", "list_id":list_id})
    else:
        return jsonify({"code": 400, "message": "Invalid event id!"})

@bp.route('/delete_event', methods=['POST'])
def delete_event():
    id = request.values.get('id')
    event = EventModel.query.filter(EventModel.id== id).first()
    db.session.delete(event)
    try:
        db.session.commit()
        return jsonify({'code':200, 'message' :"Delete the event successfully!"})
    except Exception as e:
        db.session.rollbacks()
        return jsonify({'code': 400, 'message': str(e)})

@bp.route('/edit_event', methods=['POST'])
def edit_event():
    user_id = session.get('id')
    if user_id:
        user = UserModel.query.filter(UserModel.id == user_id).first()
        if user:
            form = EventForm(request.form)
            if form:
                event_id = request.values.get('event_id')
                event = EventModel.query.filter(EventModel.id == event_id)
                title = form.event_name.data
                content = form.event_description.data
                setting_date_all = request.values.get("event_finish_date")
                setting_day = setting_date_all.split('-')
                setting_year , setting_month , setting_date = setting_day
                setting_time = request.values.get("event_finish_time")
                print(setting_time)
                setting_time = setting_time.split(":")
                setting_hour = setting_time[0]
                setting_min = setting_time[1]
                print(setting_hour+":"+setting_min)
                setting_time = datetime.strptime(setting_hour+":"+setting_min, "%H:%M").time()
                label = request.values.get("label")

                duration = (datetime.strptime(setting_date_all, "%Y-%m-%d")-datetime.now()).days + 1
                event.update(
                    {
                        'title': title,
                        'content': content,
                        'setting_date': setting_date,
                        'setting_year': setting_year,
                        'setting_month': setting_month,
                        'setting_date': setting_date,
                        'setting_time': setting_time,
                        'label': label,
                        'duration': duration,
                    }
                )
                db.session.commit()
                return redirect(url_for("index", username=user.username, id=user.id))
            else:
                return jsonify(code=400, message="Invalid form")
        else:
            return jsonify(code=400, message = "Invalid user")
    else:
        return jsonify(code=400, message = "please re-login")

@bp.route('/load_calendar', methods=['GET'])
def calendar():
    return render_template('calendar.html')

@bp.route('/duedates', methods=['POST'])
def duedates():
    id = session.get('id')
    year = request.values.get("year")
    month = request.values.get("month")
    print(year, month)
    all_event = EventModel.query.filter(EventModel.user_id ==id)
    year_event = all_event.filter(EventModel.setting_year == year)
    event_month = year_event.filter(EventModel.setting_month==month).all()
    events = []
    dates = []
    for event in event_month:
        events.append({
            "id": event.id,
        })
    for event in event_month:
        dates.append({
            "date": event.setting_date,
        })
    return jsonify(code=200, message = {"events":events,"dates":dates})

@bp.route('/del_list', methods=['POST'])
def del_list():
    user_id = session.get('id')
    id = request.values.get("id")
    todo_list = TodoListModel.query.filter(TodoListModel.user_id==user_id,TodoListModel.id==id).first()
    db.session.delete(todo_list)
    try:
        db.session.commit()
        return jsonify({'code':200, 'message' :"Delete TodoList Successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'code':400, 'message' :str(e)})

@bp.route('/get_counts', methods=['POST'])
def get_counts():
    com_num = 0
    todo_num = 0
    id = session.get('id')
    u_events = EventModel.query.filter(EventModel.user_id==id).all()
    for event in u_events:
        if event.finished:
            com_num += 1
        else:
            todo_num += 1
    print(com_num, todo_num)
    return jsonify({'code':200, 'message' :{'com_num':com_num, 'todo_num':todo_num}})