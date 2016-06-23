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
    	iconUrl: '/static/images/airport.png',
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
	var geolocation = {};
	geolocation['accuracy'] = e['accuracy'];
	geolocation['latlng'] = e['latlng'];

	$.ajax
	    ({
		type: "POST",
		url: '/',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(geolocation),
		success: function( data, textStatus, jQxhr ) {
   			markAirportsAndYourPosition(data, e);
		},
		error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
    		}
	    });
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

$( document ).ready(function() {
    	init();
	closestAirports();
});

