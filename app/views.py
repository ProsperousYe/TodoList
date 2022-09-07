from flask import render_template, flash
from app import app
from .forms import CalculatorForm

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
