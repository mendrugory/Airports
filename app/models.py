from settings import db


class Airport(db.Document):
    city = db.StringField()
    name = db.StringField()
    country = db.StringField()
    iata_faa = db.StringField(default=None)
    tz = db.StringField(default=None)
    icao = db.StringField(default=None)
    dst = db.StringField(default=None)
    loc = db.PointField(default=None)

    @staticmethod
    def get_closest_airports(lonlat, limit=10):
        """
        Using a raw query it returns the "limit" closest airports.

        :param latlon list:
        :return list of airports:
        """
        return Airport.objects(
            __raw__={"loc": {"$near": {"$geometry": {"type": "Point", "coordinates": lonlat}}}}).limit(limit)

    def __dict__(self):
        return {
            "city": self.city,
            "name": self.name,
            "country": self.country,
            "lat": self.loc["coordinates"].pop(),
            "lon": self.loc["coordinates"].pop()
        }
