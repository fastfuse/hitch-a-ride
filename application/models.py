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


# ============================================


user_role = db.Table('user_role',
                     db.Column('user_id', db.Integer(), db.ForeignKey('users.id')),
                     db.Column('role_id', db.Integer(), db.ForeignKey('roles.id')))


class User(db.Model, BaseMixin, UserMixin):
    """
    Model represents User instance
    """

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column('email', db.String(50), unique=True)
    first_name = db.Column('first_name', db.String(20))
    last_name = db.Column('last_name', db.String(20))
    password_hash = db.Column('password', db.String)
    registered_on = db.Column('registered_on', db.DateTime, default=datetime.now)

    # role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    # role = db.relationship('Role', backref=db.backref('users', lazy='dynamic')

    role = db.relationship('Role', secondary=user_role, uselist=False,
                           backref=db.backref('users', lazy='dynamic'))

    trips = db.relationship('Trip', backref='user', lazy=True)

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
    name = db.Column('name', db.String(30), unique=True)
    description = db.Column('description', db.String(255))

    def __repr__(self):
        return f"<{self.name}>"


class Trip(db.Model, BaseMixin):
    """
    Model represents trip
    """

    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    route = db.Column('route', db.String, nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
