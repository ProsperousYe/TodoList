import random
from datetime import datetime
from this import s
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from flask_mail import Message
from app.blueprints.admin import show_all_user
from app.blueprints.forms import LoginForm, RegisterForm
import string
from app import db, mail
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import EmailCaptchaModel, UserModel

# 注册了一个bp，名字叫user，前置路径是/user
bp = Blueprint("user", __name__, url_prefix="/user")


@bp.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template("register.html")
    else:
        print(request.form)
        form = RegisterForm(request.form)
        if form.validate():
            email = form.email.data
            username = form.username.data
            password = form.password.data
            register_datetime = datetime.now()
            hash_password = generate_password_hash(password)  # 存入hash形式的密码
            user = UserModel(
                email=email,
                username=username,
                password=hash_password,
                register_datetime=register_datetime
            )
            db.session.add(user)
            db.session.commit()
            print("注册成功")
            session['email'] = email
            session['password'] = password
            session.permanent = True
            return redirect(url_for("user.login"))
        else:
            print("注册失败")
            return redirect((url_for("user.register")))

@bp.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        print('get')
        email = session.get('email')
        password = session.get('password')
        if email != None and password != None:
            print("email:", email)
            print("password:", password)
            return render_template("login.html", email=email, password=password)
        else:
            return render_template("login.html")
    else:
        form = LoginForm(request.form)
        if form.validate():
            print("post")
            email = request.values.get("email")
            password = request.values.get("password")
            user_model = UserModel.query.filter_by(email=email).first()
            if user_model:
                if check_password_hash(user_model.password, password):
                    print("登录成功")
                    try:
                        print(datetime.now)
                        user_model.state = True  # 更新用户状态
                        # db.session.add(user_model)
                        db.session.commit()
                    except Exception as e:
                        db.session.rollback()
                        raise e
                    id = user_model.id
                    session["id"] = id
                    session["username"] = user_model.username
                    session.permanent = True
                    print("id in session:",session.get("id"))
                    admin = user_model.admin
                    if admin:
                        return redirect(url_for("admin.show_all_user"))
                    else:
                        # return jsonify({"code": 200})
                        return redirect(url_for("index", username=user_model.username, id=user_model.id))
                else:
                    # print(url_for("user.login"))
                    print("密码不正确")
                    return redirect(url_for("user.login", email=email, password=password))
            else:
                return jsonify({"code": 400, "message": "用户不存在"})
        else:
            # print(url_for("user.login"))
            print("not valid")
            return redirect(url_for("user.login"))


@bp.route('/logout', methods=['POST'])
def logout():
    id = session.get("id")
    print(id)
    user = UserModel.query.filter_by(id=id).first()
    if id:
        session.pop('id')
        user.state = False
        db.session.commit()
        return jsonify({"code": 200})
    else:
        return jsonify({"code": 400, "message": "登出失败"})


@bp.route('/captcha', methods=['POST'])
def get_captcha():
    email = request.values.get("email")
    operation = request.values.get("operation")
    letters = string.ascii_letters + string.digits
    captcha = "".join(random.sample(letters, 4))
    if email:
        print("验证码:" + captcha)
        message = Message(
            subject="[测试]测试验证码发送",
            recipients=[email],
            html=render_template(
                'captcha.html', operation=operation, captcha=captcha),
            charset='utf-8'
            # body="hi"
        )
        mail.send(message)
        captcha_model = EmailCaptchaModel.query.filter_by(email=email).first()
        if captcha_model:
            captcha_model.captcha = captcha
            captcha_model.create_time = datetime.now()
            db.session.commit()
        else:
            captcha_model = EmailCaptchaModel(email=email, captcha=captcha)
            db.session.add(captcha_model)
            db.session.commit()
        return jsonify({"code": 200})
    else:
        return jsonify({"code": 400, "message": "没有传递邮箱"})


@bp.route("/change_password", methods=['GET', 'POST'])
def change_password():
    if request.method == "GET":
        id = session.get('id')
        # print('change_password-id in session:',id)
        user = UserModel.query.filter_by(id=id).first()
        return render_template("change_password.html", user=user)
    else:
        try:
            id = session.get('id')
            user = UserModel.query.filter_by(id=id).first()
        except:
            return jsonify({"code": 400, "message": "session失效"})
        old_password = request.form.get('old_password')
        if not check_password_hash(user.password, old_password):
            return jsonify({"code": 400, "message": "密码不正确"})
        captcha = request.form.get("captcha")
        email = user.email
        captcha_model = EmailCaptchaModel.query.filter_by(email=email).first()
        if not captcha_model or captcha_model.captcha.lower() != captcha.lower():
            return jsonify({"code": 400, "message": "验证码不正确"})
        new_password = request.form.get("new_password")
        password_confirm = request.form.get("password_confirm")
        if not new_password == password_confirm:
            return jsonify({"code": 400, "message": "密码输入不一致"})
        hash_password = generate_password_hash(new_password)  # 存入hash形式的密码
        user.password = hash_password
        db.session.commit()
        print("修改密码成功")
        session.permanent = True
        return redirect(url_for("user.login", email=email))
