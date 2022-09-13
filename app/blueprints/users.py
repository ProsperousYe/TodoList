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

bp = Blueprint("user", __name__, url_prefix="/user")  # 注册了一个bp，名字叫user，前置路径是/user

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
            session['email']=email
            session['password']=password
            session.permanent = True
            return redirect(url_for("user.login"))
        else:
            print("注册失败")
            return redirect((url_for("user.register")))

@bp.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        print('get')
        email=session.get('email')
        password=session.get('password')
        if email!=None and password!=None:
            print("email:", email)
            print("password:", password)
            return render_template("login.html", email=email, password=password)
        else:
            return render_template("login.html")
    else:
        # print('post')
        form = LoginForm(request.form)
        if form.validate():
            email = request.values.get("email")
            password = request.values.get("password")
            user_model = UserModel.query.filter_by(email=email).first()
            if user_model:
                if check_password_hash(user_model.password, password):
                    print("登录成功")
                    try:
                        print(datetime.now)
                        user_model.state = True # 更新用户状态
                        # db.session.add(user_model)
                        db.session.commit()
                    except Exception as e:
                        db.session.rollback()
                        raise e
                    
                    admin = user_model.admin
                    if admin:
                        print(admin)
                        return redirect(url_for("admin.show_all_user"))
                    else:
                        print(admin)
                        return redirect(url_for("index", username=user_model.username, id=user_model.id))
                else:
                    # print(url_for("user.login"))
                    print("密码不正确")
                    return redirect(url_for("user.login", email=email, password=password))
            else:
                return jsonify({"code": 400, "message": "用户不存在"})
        else:
            # print(url_for("user.login"))
            return redirect(url_for("login"))

@bp.route('/logout', methods=['POST'])
def logout():
    id = request.values.get("id")
    print(id)
    user = UserModel.query.filter_by(id=id).first()
    try:
        user.state = False
        db.session.commit()
        return jsonify({"code": 200})
    except Exception as e:
        db.session.rollback()
        return jsonify({"code": 400, "message": "登出失败"})
    

@bp.route('/captcha', methods=['POST'])
def get_captcha():
    email = request.values.get("email")
    print(email)
    letters = string.ascii_letters + string.digits
    captcha = "".join(random.sample(letters, 4))
    if email:
        print("验证码:" + captcha)
        message = Message(
            subject="[测试]测试验证码发送",
            recipients=[email],
            html = render_template('captcha.html', captcha=captcha),
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
