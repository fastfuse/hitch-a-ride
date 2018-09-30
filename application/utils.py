from datetime import datetime, timedelta

import jwt

from application import app


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    """
    try:
        payload = {'exp': datetime.utcnow() + timedelta(days=1),
                   'iat': datetime.utcnow(),
                   'sub': user_id}

        return jwt.encode(payload, app.config.get('SECRET_KEY'),
                          algorithm='HS256')

    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """
    Validates the auth token
    """
    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        # is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
        # if is_blacklisted_token:
        #     return 'Token blacklisted. Please log in again.'
        # else:
        #     user_data = {'user': payload['sub'], 'role': payload['role']}
        #     return user_data

    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
