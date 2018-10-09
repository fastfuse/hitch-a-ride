"""
Admin views.
"""

from flask import url_for, redirect, request
from flask_admin import AdminIndexView, expose, helpers, Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user, login_user, logout_user

from application import models, db, login, app
from application.admin.forms import LoginForm


# Create user loader function
@login.user_loader
def load_user(user_id):
    return db.session.query(models.User).get(int(user_id))


class SecureModelView(ModelView):
    """
    Secure Model View.
    Make view accessible only for users with role 'Admin'.
    """

    def is_accessible(self):
        return current_user.is_authenticated and current_user.role.name == 'Admin'


class CustomUserView(SecureModelView):
    column_list = ['email', 'first_name', 'last_name', 'role', 'registered_on']


# ======================================================================


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


# ======================================================================


# Admin
admin = Admin(app, name="Hitch A Ride",
              index_view=SecureAdminIndexView(),
              base_template='admin/custom_nav.html',
              template_mode='bootstrap3')

admin.add_view(CustomUserView(models.User, db.session))
admin.add_view(SecureModelView(models.Role, db.session))
admin.add_view(SecureModelView(models.Trip, db.session))
admin.add_view(SecureModelView(models.TokenBlacklist, db.session))
