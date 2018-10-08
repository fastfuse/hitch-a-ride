"""
Admin views.
"""

from flask import url_for, redirect, request
from flask_admin import AdminIndexView, expose, helpers
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user, login_user, logout_user
from wtforms import form, fields, validators

from application import models, db, login


# Create user loader function
@login.user_loader
def load_user(user_id):
    return db.session.query(models.User).get(int(user_id))


# TODO: secure

class SecureModelView(ModelView):
    """
    Secure Model View.
    Make view accessible only for admin.
    """

    def is_accessible(self):
        return current_user.is_authenticated and current_user.role.name == 'Admin'


class CustomUserView(SecureModelView):
    column_list = ['email', 'first_name', 'last_name', 'role', 'registered_on']


# ======================================================================

class LoginForm(form.Form):
    email = fields.StringField(validators=[validators.required()])
    password = fields.PasswordField(validators=[validators.required()])

    def validate_email(self, field):
        user = self.get_user()

        if user is None:
            raise validators.ValidationError('Invalid email')

    def validate_password(self, field):
        if not self.user:
            return

        if not self.user.check_password(self.password.data):
            raise validators.ValidationError('Invalid password')

    def get_user(self):
        self.user = db.session.query(models.User).filter_by(email=self.email.data).first()

        return self.user


class SecureAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        if not current_user.is_authenticated:
            return redirect(url_for('.login_view'))

        return super(SecureAdminIndexView, self).index()

    @expose('/login', methods=('GET', 'POST'))
    def login_view(self):
        # handle user login
        login_form = LoginForm(request.form)

        if helpers.validate_form_on_submit(login_form):
            user = login_form.get_user()
            login_user(user)

        if current_user.is_authenticated:
            return redirect(url_for('.index'))

        self._template_args['form'] = login_form

        return super(SecureAdminIndexView, self).index()

    @expose('/logout')
    def logout_view(self):
        logout_user()

        return redirect(url_for('.index'))
