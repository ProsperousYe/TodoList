from app import db
from flask import Blueprint, request, render_template, redirect, url_for

from app.models import UserModel

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.route("/delete_user", methods=["POST"])
def delete_user():
    id = request.values.get("id")
    UserModel.query.filter(UserModel.id == id).delete()
    db.session.commit()
    return redirect(url_for("admin.show_all_user"))


@bp.route("/show_all_user")
def show_all_user():
    users = UserModel.query.all()
    return render_template('show_all_users.html', users=users)
