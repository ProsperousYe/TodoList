import random
from datetime import datetime
from flask import render_template, flash, request, redirect, url_for, jsonify, session
from app import app, db, mail
# from blueprints.forms import CalculatorForm, RegisterForm, LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message, Mail
import string

from app.blueprints.forms import CalculatorForm
from .models import UserModel, EmailCaptchaModel

@app.route('/index/?<username>&<id>')
def index(username, id):
    user = {
        'name': username,
        'id' : id
    }
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

@app.route('/forget_password', methods=['GET', 'POST'])
def forget_password():
    if request.method == 'GET':
        return render_template('forget_password.html')
    else:
        try:
            email  = request.form.get('email')
            user = UserModel.query.filter_by(email=email).first()
        except:
            return jsonify({"code": 400, "message": "邮箱不存在"})
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

@app.route("/", methods=["GET", "POST"])
def default():
    return redirect(url_for("user.login"))

@app.route("/nav", methods=["GET"])
def nav():
    print("get nav")
    id = request.values.get("id")
    user = UserModel.query.filter(UserModel.id==id).first()
    return render_template('nav.html', user=user)

@app.route("/home", methods=["GET"])
def home():
    id = session.get("id")
    user = UserModel.query.filter(UserModel.id==id).first()
    print(url_for('index', username=user.username, id=id))
    return url_for('index', username=user.username, id=id)