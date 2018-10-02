"""
Admin views.
"""

from flask_admin.contrib.sqla import ModelView

from application import admin, models, db


# TODO: secure

class SecureModelView(ModelView):
    """
    Secure Model View.
    Make view accessible only for admin.
    """

    column_list = ['email', 'first_name', 'last_name', 'role', 'registered_on']


admin.add_view(SecureModelView(models.User, db.session))
admin.add_view(ModelView(models.Role, db.session))
admin.add_view(ModelView(models.Trip, db.session))
