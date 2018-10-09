"""
Authentication views.
"""

from flask import request, make_response, jsonify
from flask.views import MethodView
from flask_jwt_extended import (create_access_token,
                                create_refresh_token,
                                jwt_refresh_token_required,
                                get_jwt_identity,
                                jwt_required,
                                get_jti,
                                get_raw_jwt)

from application import logger as log
from application import models, utils, jwt
from application.exceptions import TokenNotFound
from application.utils import is_revoked, revoke_token, store_token
from . import auth_blueprint


# Callback function to check if a token has been revoked
@jwt.token_in_blacklist_loader
def check_if_token_revoked(decoded_token):
    return is_revoked(decoded_token)


class RegistrationView(MethodView):
    """
    User Registration Resource
    """

    def post(self):
        # get the post data
        data = request.get_json()

        # check if user already exists
        user = models.User.query.filter_by(email=data.get('email')).first()

        if not user:
            try:
                user = models.User(email=data.get('email'),
                                   first_name=data.get('first_name'),
                                   last_name=data.get('last_name'))

                role = models.Role.query.filter_by(name=data.get('role')).one_or_none()

                if not role:
                    response = utils.json_resp('Fail', 'Some error occurred. Please try again')
                    return make_response(jsonify(response)), 401

                user.role = role
                user.hash_password(data.get('password'))
                user.save()

                response = utils.json_resp('Success', 'Successfully registered')

                return make_response(jsonify(response)), 201

            except Exception as e:
                log.error(e)
                response = utils.json_resp('Fail', 'Some error occurred. Please try again')
                return make_response(jsonify(response)), 401

        else:
            response = utils.json_resp('Fail', 'User already exists. Please Log in')
            return make_response(jsonify(response)), 202


class LoginView(MethodView):
    """
    User Login Resource
    """

    def post(self):
        # get the post data
        data = request.get_json()

        # TODO: validate json

        try:
            # fetch user data
            user = models.User.query.filter_by(email=data.get('email')).first()

            if user and user.check_password(data.get('password')):

                access_token = create_access_token(identity=user.email)
                refresh_token = create_refresh_token(identity=user.email)

                # store tokens to db
                store_token(access_token)
                store_token(refresh_token)

                response = {'status': 'Success',
                            'message': 'Successfully logged in',
                            'access_token': access_token,
                            'refresh_token': refresh_token
                            }

                return make_response(jsonify(response)), 200

            else:
                response = utils.json_resp('Fail', 'User does not exist')
                return make_response(jsonify(response)), 404

        except Exception as e:
            log.error(e)
            response = utils.json_resp('Fail', 'Try again')
            return make_response(jsonify(response)), 500


class LogoutView(MethodView):
    """
    User logout Resource.
    Invalidate (blacklist) user's access and refresh tokens
    """

    decorators = [jwt_required]

    def post(self):
        data = request.get_json()

        user_identity = get_jwt_identity()

        # TODO: refactor
        access_token_id = get_raw_jwt().get("jti")
        refresh_token_id = get_jti(data.get("refresh_token"))

        try:
            revoke_token(access_token_id, user_identity)
            revoke_token(refresh_token_id, user_identity)

            response = utils.json_resp('Success', 'Successfully Logged out')

            return make_response(jsonify(response)), 200

        except TokenNotFound as e:
            log.error(e)

            response = utils.json_resp('Failure', 'The specified token was not found')

            return make_response(jsonify(response)), 404


class RefreshTokenView(MethodView):
    """
    Token refresh Resource
    """

    decorators = [jwt_refresh_token_required]

    def post(self):
        user_identity = get_jwt_identity()
        access_token = create_access_token(identity=user_identity)
        store_token(access_token)

        response = {'status': 'Success',
                    'access_token': access_token
                    }

        return make_response(jsonify(response)), 200


# =====================   Register endpoints   ==============================

auth_blueprint.add_url_rule('/register',
                            view_func=RegistrationView.as_view('registration'),
                            methods=['POST'])

auth_blueprint.add_url_rule('/login',
                            view_func=LoginView.as_view('login'),
                            methods=['POST'])

auth_blueprint.add_url_rule('/logout',
                            view_func=LogoutView.as_view('logout'),
                            methods=['POST'])

auth_blueprint.add_url_rule('/refresh',
                            view_func=RefreshTokenView.as_view('refresh'),
                            methods=['POST'])
