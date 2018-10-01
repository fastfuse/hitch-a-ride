from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from application import db, login


class BaseMixin:
    """
    Some convenience methods
    """

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model, BaseMixin, UserMixin):
    """
    Model represents User instance
    """

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column('email', db.String(20), unique=True)
    first_name = db.Column('first_name', db.String(20))
    last_name = db.Column('last_name', db.String(20))
    password_hash = db.Column('password', db.String)

    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    role = db.relationship('Role', backref=db.backref('users', lazy='dynamic'))

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.email)


class Role(db.Model, BaseMixin):
    """
    Model represents role
    """

    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column('role', db.String(20))
