from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from application import db

STATUSES = ['Scheduled', 'Opted', 'Completed', 'Cancelled']


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
    confirmed = db.Column('confirmed', db.Boolean, default=False)
    confirmed_on = db.Column('confirmed_on', db.DateTime, nullable=True)

    role = db.relationship('Role', secondary=user_role, uselist=False,
                           backref=db.backref('users', lazy='dynamic'))

    # trips = db.relationship('Trip', backref='user', lazy=True)

    # rides = db.relationship('Trip', backref='driver', lazy=True)

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def dump(self):
        data = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'role': self.role.name
        }

        return data

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
    departure = db.Column('timestamp', db.DateTime, nullable=False)
    status = db.Column('status', db.Enum(*STATUSES, name='trip_status'))

    hitchhiker_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    hitchhiker = db.relationship('User', foreign_keys=[hitchhiker_id])
    driver = db.relationship('User', foreign_keys=[driver_id])

    def dump(self):
        data = {
            'id': self.id,
            'route': self.route,
            'departure': self.departure.timestamp(),
            'status': self.status
        }

        return data


class TokenBlacklist(db.Model, BaseMixin):
    """
    Models represents Blacklisted JWT tokens
    """

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False)
    token_type = db.Column(db.String(10), nullable=False)
    user_identity = db.Column(db.String(50), nullable=False)
    revoked = db.Column(db.Boolean, nullable=False)
    expires = db.Column(db.DateTime, nullable=False)

    def dump(self):
        return {
            'token_id': self.id,
            'jti': self.jti,
            'token_type': self.token_type,
            'user_identity': self.user_identity,
            'revoked': self.revoked,
            'expires': self.expires
        }
