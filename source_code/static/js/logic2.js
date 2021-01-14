var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

function getColor(d) {
  return d > 5 ? '#ef5a5a' :
         d > 4  ? '#da8b4a' :
         d > 3  ? '#eaaf3f' :
         d > 2  ? '#e3c826' :
         d > 1   ? '#cbdf29' :
                    '#a4e039';
};

function style(feature) {
  return {
    radius: feature.properties.mag*5,
      fillColor: getColor(feature.properties.mag),
      weight: 1,
      opacity: 0.7,
      color: "#555",
      fillOpacity: 1
  }
};

var earthquakes = new L.LayerGroup();

d3.json(queryUrl, function(data) {
  L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style);
    },
    style: style,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>Magnitude:" +feature.properties.mag+ "</p>"+"<p>"+ new Date(feature.properties.time) + "</p>");
    }
  }).addTo(earthquakes);
  createMap(earthquakes);
});


var plates = new L.LayerGroup();
d3.json(tectonicplates, function(data) {
  L.geoJSON(data.features, {
    color: "orange",
    fillOpacity: 0
}).addTo(plates);
})

function createMap() {

  // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": streetmap,
    "Outdoors": outdoorsmap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Fault Lines": plates,
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      15, -40
    ],
    zoom: 3,
    layers: [satellitemap, plates, earthquakes]
  });

  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (myMap) {
    function getColor(d) {
      return d > 5 ? '#ef5a5a' :
             d > 4  ? '#da8b4a' :
             d > 3  ? '#eaaf3f' :
             d > 2  ? '#e3c826' :
             d > 1   ? '#cbdf29' :
                        '#a4e039';
    }
    
		var div = L.DomUtil.create('div', 'info legend'),
			mhis = [0, 1, 2, 3, 4, 5],
			labels = [],
			from, to;

		for (var i = 0; i < mhis.length; i++) {
			from = mhis[i];
			to = mhis[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(myMap);
}



