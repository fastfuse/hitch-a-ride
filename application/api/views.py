"""
API views
"""

from flask import jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity

from application import logger as log
from . import api_blueprint


@api_blueprint.route('/secured')
@jwt_required
def secured():
    user_email = get_jwt_identity()

    log.info(user_email)

    return jsonify(status='Success')
