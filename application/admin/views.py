"""
Admin views.
"""

from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from application import admin, models, db


class SecureModelView(ModelView):
    """
    Secure Model View.
    Make view accessible only for admin.
    """
    # exclude password hash from admin view
    column_exclude_list = ['password_hash', ]

    # def is_accessible(self):
    #     return current_user.is_authenticated and current_user.role.role == 'Admin'


admin.add_view(SecureModelView(models.User, db.session))
admin.add_view(ModelView(models.Role, db.session))
admin.add_view(ModelView(models.Trip, db.session))
# admin.add_view(ModelView(models.Transaction, db.session))
# admin.add_view(ModelView(models.Reader, db.session))
# admin.add_view(ModelView(models.Vehicle, db.session))
