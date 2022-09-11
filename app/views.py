import random
from datetime import datetime
from flask import render_template, flash, request, redirect, url_for, jsonify
from app import app, db, mail
from .forms import CalculatorForm, RegisterForm, LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message, Mail
import string
from .models import UserModel, EmailCaptchaModel

@app.route('/')
def index():
    user = {'name': 'Yxk'}
    return render_template('index.html',
                        title = "test",
                        user = user)

@app.route('/calculator', methods=['GET','POST'])
def calculator():
    form = CalculatorForm()
    if form.validate_on_submit():
        flash('Successfully received form data. %s + %s = %s'%(form.number1.data, form.number2.data, form.number1.data + form.number2.data))
    return render_template('calculator.html',
                            title='Calculator',
                            form = form)

@app.route('/register', methods=['POST', 'GET'])
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
            return redirect(url_for("login"))
        else:
            print("注册失败")
            return redirect((url_for("register")))

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        # print('get')
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
                    # try:
                    #     print(datetime.now)
                    #     user_model.last_login_datetime = datetime.now # 更新最近登录时间
                    #     db.session.add(user_model)
                    #     db.session.commit()
                    # except Exception as e:
                    #     db.session.rollback()
                    #     raise e
                    return redirect(url_for("index"))
                else:
                    # print(url_for("user.login"))
                    print("密码不正确")
                    return redirect(url_for("login"))
            else:
                return jsonify({"code": 400, "message": "用户不存在"})
        else:
            # print(url_for("user.login"))
            return redirect(url_for("login"))

@app.route('/captcha', methods=['POST'])
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

