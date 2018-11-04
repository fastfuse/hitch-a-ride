from wtforms import form, fields, validators

from application import models, db


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
