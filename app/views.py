from app import application
from flask import render_template, request
from models import Airport
import json


@application.route("/", methods=['GET', 'POST'])
def closest_airports():
    if request.method == 'POST':
        body = request.get_json()
        location = body["latlng"]
        accuracy = body["accuracy"]
        lon = float(location["lng"])
        lat = float(location["lat"])
        airports = []
        queryset = Airport.get_closest_airports([lon, lat])
        for airport in queryset:
            airports.append(airport.__dict__())
        return json.dumps(airports)
    else:  # GET
        return render_template("closest_airports_response.html")