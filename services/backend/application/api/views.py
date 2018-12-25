"""
API views
"""
import datetime

from flask import jsonify, make_response, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity

from application import models, app, logger as log
from application.utils import epoch_utc_to_datetime
from . import api_blueprint

STATUSES = app.config.get('STATUSES')


# TODO: add logging

class TripsAPI(MethodView):
    """
    Trips Resource
    """

    # decorators = [jwt_required]

    def get(self, trip_id):
        """
        Retrieve all trips or single trip by ID

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
                           user_id=user.id,
                           status='Scheduled')
        trip.save()

        return make_response(jsonify(status='Created')), 201

    def patch(self, trip_id):
        """
        Edit trip data
        """
        data = request.get_json()

        trip = models.Trip.query.get_or_404(trip_id)

        for k, v in data.items():
            if k == 'departure':
                v = epoch_utc_to_datetime(v)
            setattr(trip, k, v)

        trip.save()

        return make_response(jsonify(status='Updated')), 204

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

        user = models.User.query.get_or_404(user_id)

        return make_response(jsonify(user.dump())), 200


class RideAPI(MethodView):
    """
    Ride Resource (driver's and hitchhiker's common trip)
    """

    decorators = [jwt_required]

    def get(self, ride_id):
        """
        Retrieve all rides or single ride by ID
        """

        if ride_id:
            ride = models.Ride.query.get_or_404(ride_id)

            return make_response(jsonify(ride.dump())), 200

        else:
            rides = models.Ride.query.all()

            return make_response(jsonify(trips=[ride.dump() for ride in rides])), 200

    def post(self):
        """
        Create ride
        """
        data = request.get_json()

        hitchhiker_trip = models.Trip.query.get_or_404(data.get('hitchhiker_trip_id'))
        driver_trip = models.Trip.query.get_or_404(data.get('driver_trip_id'))

        hitchhiker_trip.status = 'Opted'
        driver_trip.status = 'Opted'

        ride = models.Ride(hitchhiker_trip_id=hitchhiker_trip.id,
                           driver_trip_id=driver_trip.id)
        ride.save()

        hitchhiker_trip.save()
        driver_trip.save()

        return make_response(jsonify(status='Created')), 201


# =====================   Register endpoints   ==============================

trips_view = TripsAPI.as_view('trips_api')
rides_view = RideAPI.as_view('rides_api')

api_blueprint.add_url_rule('/trips',
                           defaults={'trip_id': None},
                           view_func=trips_view,
                           methods=['GET'])

api_blueprint.add_url_rule('/trips',
                           view_func=trips_view,
                           methods=['POST'])

api_blueprint.add_url_rule('/trips/<int:trip_id>',
                           view_func=trips_view,
                           methods=['GET', 'PATCH', 'DELETE'])

api_blueprint.add_url_rule('/user',
                           view_func=UserAPI.as_view('user_api'),
                           methods=['GET'])

api_blueprint.add_url_rule('/rides/<int:ride_id>',
                           view_func=rides_view,
                           methods=['GET'])

api_blueprint.add_url_rule('/rides',
                           defaults={'ride_id': None},
                           view_func=rides_view,
                           methods=['GET'])

api_blueprint.add_url_rule('/rides',
                           view_func=rides_view,
                           methods=['POST'])
