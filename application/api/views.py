"""
API views
"""
import datetime

from flask import jsonify, make_response, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity

from application import logger as log, models
from application.utils import epoch_utc_to_datetime
from . import api_blueprint


@api_blueprint.route('/secured')
@jwt_required
def secured():
    user_email = get_jwt_identity()

    log.info(user_email)

    return jsonify(status='Success')


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

        else:
            # TODO: GET all for user of ALL?
            user_identity = get_jwt_identity()
            user = models.User.query.filter_by(email=user_identity).first()

            trips = models.Trip.query.filter_by(hitchhiker_id=user.id).all()

        return make_response(jsonify(trips=[trip.dump() for trip in trips])), 200

    def post(self):
        """
        Create trip
        """
        data = request.get_json()

        user_identity = get_jwt_identity()
        user = models.User.query.get(user_identity)

        # TODO: fix json issue
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
        Delete trip
        """

        # TODO: change status (soft delete)
        trip = models.Trip.query.get_or_404(trip_id)

        trip.status = "Cancelled"
        trip.save()

        return make_response(jsonify(status='Success', message='Successfully deleted')), 200


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
