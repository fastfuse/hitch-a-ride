from collections import namedtuple
from datetime import datetime

from flask_jwt_extended import decode_token
from sqlalchemy.orm.exc import NoResultFound

from application import db
from application.exceptions import TokenNotFound
from application.models import TokenBlacklist

from itsdangerous import URLSafeTimedSerializer

from flask_mail import Message

from . import app, mail


from . import app

# ===================  namedtuple to simplify creation of response messages  ===================

Response = namedtuple('Response', ['status', 'message'])


# ===================================================================================

def json_resp(status, message):
    """
    JSON-formatted response
    """
    return Response(status, message)._asdict()


# JSON validation

# BASE_SCHEMA = Schema({
#     Required('ticket_uid'): All(str, Length(min=1))
# })
#
# PAYMENT_SCHEMA = BASE_SCHEMA.extend({
#     Required('vehicle_uid'): All(str, Length(min=1)),
#     Required('transaction_uid'): All(str, Length(min=1))
# })
#
# REFILL_SCHEMA = BASE_SCHEMA.extend({
#     Required('trips', default=1): int
# })
#
# VALIDATION_SCHEMA = BASE_SCHEMA.extend({
#     Required('vehicle_uid'): All(str, Length(min=1))
# })


# ======================== Blacklist helpers ================

# TODO: move to auth.utils ?

def _epoch_utc_to_datetime(epoch_utc):
    """
    Helper function for converting epoch timestamps (as stored in JWTs) into
    python datetime objects (which are easier to use with sqlalchemy).
    """
    return datetime.fromtimestamp(epoch_utc)


def store_token(encoded_token, identity_claim='identity'):
    """
    Adds a new token to the database. It is not revoked when it is added.
    """
    decoded_token = decode_token(encoded_token)
    jti = decoded_token['jti']
    token_type = decoded_token['type']
    user_identity = decoded_token[identity_claim]
    expires = _epoch_utc_to_datetime(decoded_token['exp'])

    db_token = TokenBlacklist(
        jti=jti,
        token_type=token_type,
        user_identity=user_identity,
        expires=expires,
        revoked=False,
    )

    db_token.save()


def is_revoked(decoded_token):
    """
    Checks if the given token is revoked or not. Because we are adding all the
    tokens that we create into this database, if the token is not present
    in the database we are going to consider it revoked, as we don't know where
    it was created.
    """
    jti = decoded_token['jti']

    try:
        token = TokenBlacklist.query.filter_by(jti=jti).one()
        return token.revoked

    except NoResultFound:
        return True


def get_user_tokens(user_identity):
    """
    Returns all of the tokens for the given user
    """
    return TokenBlacklist.query.filter_by(user_identity=user_identity).all()


def revoke_token(token_id, user):
    """
    Revokes the given token. Raises a TokenNotFound error if the token does
    not exist in the database
    """
    try:
        token = TokenBlacklist.query.filter_by(jti=token_id, user_identity=user).one()
        token.revoked = True
        db.session.commit()

    except NoResultFound:
        raise TokenNotFound("Could not find the token {}".format(token_id))


def prune_database():
    """
    Delete tokens that have expired from the database.
    How (and if) you call this is entirely up you. You could expose it to an
    endpoint that only administrators could call, you could run it as a cron,
    set it up with flask cli, etc.
    """
    now = datetime.now()
    expired = TokenBlacklist.query.filter(TokenBlacklist.expires < now).all()

    for token in expired:
        token.delete()

    db.session.commit()


def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email


def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    mail.send(msg)
