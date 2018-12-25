"""
Authentication views.
"""

import datetime

from flask import request, make_response, jsonify, url_for, render_template
from flask.views import MethodView
from flask_jwt_extended import (create_access_token,
                                create_refresh_token,
                                jwt_refresh_token_required,
                                get_jwt_identity,
                                jwt_required,
                                get_jti,
                                get_raw_jwt)

from application import logger as log
from application import models, utils, app
from application.exceptions import TokenNotFound
from application.tasks import send_email
from itsdangerous import SignatureExpired, BadSignature

from . import auth_blueprint


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
                    response = utils.json_resp('Fail', 'Some error occurred. Please try again later')
                    return make_response(jsonify(response)), 500

                user.role = role
                user.hash_password(data.get('password'))
                user.save()

                # Generate confirmation token and send email
                token = utils.generate_confirmation_token(user.email)
                confirm_url = url_for('auth_blueprint.confirm_email', token=token, _external=True)
                html = render_template('email_confirm.html', confirm_url=confirm_url)
                # TODO: use configurable message
                subject = "Registration confirm"

                send_email.delay(user.email, subject, html)

                response = utils.json_resp('Success', 'Successfully registered')

                return make_response(jsonify(response)), 201

            except Exception as e:
                log.error(e)
                response = utils.json_resp('Fail', 'Some error occurred. Please try again later')
                return make_response(jsonify(response)), 500

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

            if user:
                if not user.confirmed:
                    response = utils.json_resp('Fail', 'Please confirm your email to validate account')
                    return make_response(jsonify(response)), 400

                if user.check_password(data.get('password')):
                    access_token = create_access_token(identity=user)
                    refresh_token = create_refresh_token(identity=user)

                    # store tokens to db
                    utils.store_token(access_token)
                    utils.store_token(refresh_token)

                    response = {'status': 'Success',
                                'message': 'Successfully logged in',
                                'access_token': access_token,
                                'refresh_token': refresh_token
                                }

                    return make_response(jsonify(response)), 200

                else:
                    response = utils.json_resp('Fail', 'Invalid password')
                    return make_response(jsonify(response)), 400

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

        user_identity = str(get_jwt_identity())
        access_token_id = get_raw_jwt().get("jti")
        refresh_token_id = get_jti(data.get("refresh_token"))

        try:
            utils.revoke_token(access_token_id, user_identity)
            utils.revoke_token(refresh_token_id, user_identity)

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

    def get(self):
        user_identity = get_jwt_identity()

        user = models.User.query.get(user_identity)

        access_token = create_access_token(identity=user)
        utils.store_token(access_token)

        response = {'status': 'Success',
                    'access_token': access_token
                    }

        return make_response(jsonify(response)), 200


def confirm_email(token):
    """
    Email confirmation view
    """
    try:
        email = utils.confirm_token(token)

    except (SignatureExpired, BadSignature):
        message = 'The confirmation link is invalid or expired'

        return render_template('registration_confirm.html', message=message)

    user = models.User.query.filter_by(email=email).first_or_404()

    if user.confirmed:
        message = 'Account already confirmed. Please login.'

    else:
        user.confirmed = True
        user.confirmed_on = datetime.datetime.now()
        user.save()

        message = 'You have successfully confirmed your account'

    login_url = app.config['CLIENT_APP_URL']

    return render_template('registration_confirm.html', message=message, login_url=login_url)


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
                            methods=['GET'])

auth_blueprint.add_url_rule('/confirm/<token>',
                            view_func=confirm_email,
                            methods=['GET'])
