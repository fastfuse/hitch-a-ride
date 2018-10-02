# -*- coding: utf-8 -*-

"""
Authentication views.
"""
from flask import request, make_response, jsonify
from flask.views import MethodView
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_refresh_token_required, get_jwt_identity

from application import logger as log
from application import models, utils, db
from . import auth_blueprint


class RegistrationView(MethodView):
    """
    User Registration Resource
    """

    def post(self):
        # get the post data

        data = request.get_json()
        # print(data)

        # try:
        #     BASE_SCHEMA(data)
        # except MultipleInvalid as e:
        #     return jsonify(json_resp("Failure", str(e))), 400

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

                db.session.add(user)
                db.session.commit()

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
            # fetch the user data
            user = models.User.query.filter_by(email=data.get('email')).first()

            if user and user.check_password(data.get('password')):
                response = {'status': 'Success',
                            'message': 'Successfully logged in',
                            'access_token': create_access_token(identity=user.email),
                            'refresh_token': create_refresh_token(identity=user.email)
                            }

                return make_response(jsonify(response)), 200

            else:
                response = utils.json_resp('Fail', 'User does not exist')
                return make_response(jsonify(response)), 404

        except Exception as e:
            log.error(e)
            response = utils.json_resp('Fail', 'Try again')
            return make_response(jsonify(response)), 500


class RefreshTokenView(MethodView):
    """
    Token refresh Resource
    """

    decorators = [jwt_refresh_token_required]

    def post(self):
        # get the post data
        # data = request.get_json()

        # TODO: validate json
        # TODO: check user existence
        email = get_jwt_identity()

        response = {'status': 'Success',
                    'access_token': create_access_token(identity=email)
                    }

        return make_response(jsonify(response)), 200


# =====================   Register endpoints   ==============================

auth_blueprint.add_url_rule('/register',
                            view_func=RegistrationView.as_view('registration'),
                            methods=['POST'])

auth_blueprint.add_url_rule('/login',
                            view_func=LoginView.as_view('login'),
                            methods=['POST'])

auth_blueprint.add_url_rule('/refresh',
                            view_func=RefreshTokenView.as_view('refresh'),
                            methods=['POST'])
