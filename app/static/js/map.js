function init()
{
	map = L.map('map');
	mapLink =
	'<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: ' Where is my airport? &copy; ' + mapLink,
			maxZoom: 18,
		}).addTo(map);
}

function setView(lat, lon)
{
	map.setView([lat, lon], 11);
}

function mark(lat, lon, message)
{
	var marker = L.marker([lat, lon]).addTo(map)
	if (message != null)
	{
		marker.bindPopup(message);
	}
	return marker
}

function customMark(lat, lon, message, icon)
{
	var marker = L.marker([lat, lon], {icon: icon}).addTo(map)
	if (message != null)
	{
		marker.bindPopup(message);
	}
	return marker
}

function onLocationFound(e) 
{
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
	.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

function markAirports(airports)
{
	var airportIcon = L.icon({
    iconUrl: 'http://excellencyairportlimousine.com/pics/airport.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [-3, -76],
    
});

	for(var i = 0; i < airports.length; i++) 
	{
	    var airport = airports[i];
	    var city = airport["city"];
	    var name = airport["name"];
	    var lat = airport["lat"];
	    var lon = airport["lon"];

	    customMark(lat, lon, name, airportIcon);
	}
}

function markAirportsAndYourPosition(airports, e)
{
	setView(e.latlng["lat"], e.latlng["lng"]);

	markAirports(airports);
	onLocationFound(e);
}


function onLocationClosest(e)
{
	var handleResponse = function (status, response) {
		alert(response)
	}

	var handleStateChange = function(xmlhttp)
	{
		return  (xmlhttp.readyState == 4) ? handleResponse(xmlhttp.status, xmlhttp.response) : null;
	}

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/", false);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');
	xmlhttp.onreadystatechange = handleStateChange(xmlhttp);

	var geolocation = {};
	geolocation['accuracy'] = e['accuracy'];
	geolocation['latlng'] = e['latlng'];

	seen = [];
	xmlhttp.send(JSON.stringify(geolocation, function(key, val) 
	{
		if (val != null && typeof val == "object") {
			if (seen.indexOf(val) >= 0)
				return
			seen.push(val)
		}
		return val
	}));

	var response = JSON.parse(xmlhttp.response);
   	markAirportsAndYourPosition(response, e);
}

function onLocationError(e) 
{
	alert(e.message);
}

function locate()
{
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	
	map.locate({setView: true, maxZoom: 18});
}

function closestAirports()
{
    map.on('locationfound', onLocationClosest);
	map.on('locationerror', onLocationError);

	map.locate();
}



var markers = {}
var map = null;
