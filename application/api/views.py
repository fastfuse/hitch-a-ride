"""
API views
"""
import datetime

from flask import jsonify, make_response, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity

from application import logger as log, models, app
from application.utils import epoch_utc_to_datetime
from . import api_blueprint

STATUSES = app.config.get('STATUSES')


# TODO: add logging

class TripsAPI(MethodView):
    """
    Trips Resource
    """

    decorators = [jwt_required]

    def get(self, trip_id):
        """
        Retrieve all trips for current user or single trip by ID

        /trips - return all for user
        /trips?departure=<unix_timestamp> - filter by departure date
        /trips/<trip_id> - get by ID
        """

        if trip_id:
            trip = models.Trip.query.get_or_404(trip_id)

            return make_response(jsonify(trip.dump())), 200

        if 'departure' in request.args:
            departure = epoch_utc_to_datetime(float(request.args.get('departure')))
            hour = datetime.timedelta(hours=1)

            trips = models.Trip.query.filter(
                models.Trip.departure.between(departure - hour, departure + hour)).all()

        elif 'status' in request.args:
            status = request.args.get('status')
            if status not in STATUSES:
                return make_response(jsonify(status='Fail', message='Invalid status')), 400

            trips = models.Trip.query.filter_by(status=status).all()

        elif 'user_id' in request.args:
            user = models.User.query.get(request.args.get('user_id'))

            if user:
                trips = models.Trip.query.filter_by(hitchhiker_id=user.id).all()

            else:
                trips = []

        else:
            trips = models.Trip.query.all()

        return make_response(jsonify(trips=[trip.dump() for trip in trips])), 200

    def post(self):
        """
        Create trip
        """
        data = request.get_json()

        user_identity = get_jwt_identity()
        user = models.User.query.get(user_identity)

        trip = models.Trip(route=data.get('route'),
                           departure=epoch_utc_to_datetime(data.get('departure')),
                           hitchhiker_id=user.id,
                           status='Scheduled')
        trip.save()

        return make_response(jsonify(status='Created')), 201

    def patch(self, trip_id):
        # TBD
        pass

    def delete(self, trip_id):
        """
        Delete trip (aka cancel)
        """

        trip = models.Trip.query.get_or_404(trip_id)

        trip.status = "Cancelled"
        trip.save()

        return make_response(jsonify(status='Success', message='Successfully deleted')), 200


class UserAPI(MethodView):
    """
    User data Resource
    """

    decorators = [jwt_required]

    def get(self):
        """
        Get user data
        """
        user_id = get_jwt_identity()

        user = models.User.query.get(user_id)

        return make_response(jsonify(user.dump())), 200


# =====================   Register endpoints   ==============================

trips_view = TripsAPI.as_view('trips_api')

api_blueprint.add_url_rule('/trips',
                           defaults={'trip_id': None},
                           view_func=trips_view,
                           methods=['GET'])

api_blueprint.add_url_rule('/trips',
                           view_func=trips_view,
                           methods=['POST'])

api_blueprint.add_url_rule('/trips/<int:trip_id>',
                           view_func=trips_view,
                           methods=['GET'])

api_blueprint.add_url_rule('/trips/<int:trip_id>',
                           view_func=trips_view,
                           methods=['DELETE'])

api_blueprint.add_url_rule('/user',
                           view_func=UserAPI.as_view('user_api'),
                           methods=['GET'])
