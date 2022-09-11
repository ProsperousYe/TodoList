import wtforms
from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, length, email, EqualTo

from app.models import EmailCaptchaModel, UserModel
# from models import EmailCaptchaModel, UserModel


class CalculatorForm(FlaskForm):
    number1 = wtforms.IntegerField('number1', validators=[DataRequired()])
    number2 = wtforms.IntegerField('number2', validators=[DataRequired()])


class LoginForm(wtforms.Form):
    email = wtforms.StringField(validators=[length(min=5, max=20), email()])
    password = wtforms.StringField(validators=[length(min=6, max=20)])


class RegisterForm(wtforms.Form):
    username = wtforms.StringField(validators=[length(min=1, max=20)])
    email = wtforms.StringField(validators=[email()])
    captcha = wtforms.StringField(validators=[length(min=4, max=4)])
    password = wtforms.StringField(validators=[length(min=1, max=20)])
    password_confirm = wtforms.StringField(validators=[EqualTo('password')])

    def validate_captcha(self, field):
        captcha = field.data
        email = self.email.data
        captcha_model = EmailCaptchaModel.query.filter_by(email=email).first()
        if not captcha_model or captcha_model.captcha.lower() != captcha.lower():
            raise wtforms.ValidationError("邮箱验证码错误！")

    def validate_email(self, field):
        email = field.data
        user_model = UserModel.query.filter_by(email=email).first()
        if user_model:
            raise wtforms.ValidationError("邮箱已经存在！")