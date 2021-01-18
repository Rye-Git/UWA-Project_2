let urlCity = "/api/population/cities";
let urlPop = "/api/population/countries";
// Load in geojson data for marking Countries
let geoDataURL = "static/data/countries.geojson";


  // Grab Countries geo data with d3 from countries geojson
  d3.json(geoDataURL).then(function(data) {

    // reading Api json to merge data with geojson
    d3.json(urlPop).then(function(dataPop){
      // Adding Population data into the geojson data
      let popCountriesData = dataPop[0]["data"];
      let key = "2020";
      data.features.forEach(val => {
        for( let i=0; i<popCountriesData.length; i++){
          if(val.id == popCountriesData[i]["Country_Code"]){
            let { properties } = val
            let newProps = { key: popCountriesData[i][key] }
            val.properties = { ...properties, ...newProps }
          }  
        }
      })
    });


    // Top 10 Cities markers
    d3.json(urlCity).then(function(cityData){  
    // An array which will be used to store created cityMarkers
    var cityMarkers = [];
    var cityCircleMarkers = [];

    // getting data from cities json API
    var cities = cityData[0]["data"];
    // Loop through top 10 cities and create city markers
    for (let i = 0; i < 10; i++) {
      let coordinates = [cities[i].Latitude, cities[i].Longitude];
      let population = cities[i]["2020"];
      // create a new marker, push it to the cityMarkers array
      cityMarkers.push(
        L.marker(coordinates).bindPopup("<h3>" + cities[i].City + "</h3> <hr> <h5>Population: " + population + "</h5>")
      );
      cityCircleMarkers.push(
        L.circle(coordinates, {
          fillOpacity: 1,
          color: "black",
          fillColor: "black",
          radius: population/50
      }).bindPopup("<h3>" + cities[i].City + "</h3> <hr> <h5>Population: " + population + "</h5>")); 
    }
    // Add all the cityMarkers to a new layer group.
    var cityLayer = L.layerGroup(cityMarkers);
    var cityCircleLayer = L.layerGroup(cityCircleMarkers);
    cityLayer.addLayer(cityCircleLayer);


    

    // Define variables for our tile layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 6,
      minZoom: 1,
      id: "light-v10",
      accessToken: API_KEY
    });
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 6,
      minZoom: 1,
      id: "dark-v10",
      accessToken: API_KEY
    });
    // Only one base layer can be shown at a time
    var baseMaps = {
      Light: light,
      Dark: dark
    };
    // Overlays that may be toggled on or off
    var overlayMaps = {
      Cities: cityLayer
    };
      // Creating map object
    var myMap = L.map("map", {
      center: [34.0522, 10.2437],
      zoom: 2,
      layers: [light]
    });
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);



    

    function getColor(d) {
<<<<<<< HEAD
      return d > 100000000 ? '#034E7B' :
             d > 30000000  ? '#0570B0' :
             d > 20000000  ? '#3690C0' :
=======
      return d > 1000000000 ? '#034E7B' :
             d > 200000000  ? '#0570B0' :
             d > 100000000  ? '#3690C0' :
>>>>>>> cb732c921ae2da713bf9ea8654f3b9db419a4b03
             d > 10000000  ? '#74A9CF' :
             d > 1000000   ? '#A6BDDB' :
             d > 100000  ? '#D0D1E6' :
             d > 10000   ? '#ECE7F2' :
                        '#FFF7FB';
    }
    function style(feature) {
      return {
          fillColor: getColor(feature.properties.key),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }
    // control that shows state info on hover
    var info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    info.update = function (props) {
      this._div.innerHTML = '<h4>2020 Population</h4>' +  (props ?
              '<b> Country:' + props.name + '</b><br /> Population:' + props.key + '</sup>'
              : 'Hover over a Country');
    };
    function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
              weight: 5,
              color: '#616161',
              dashArray: '',
              fillOpacity: 0.7
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
          }
          info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
          geojson.resetStyle(e.target);
          info.update();
    }
    function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
    }
    function onEachFeature(feature, layer) {
          layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
              click: zoomToFeature
          });
    }
    geojson = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(myMap);
      info.addTo(myMap);
<<<<<<< HEAD
    cityLayer.addTo(myMap);
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              mhis = [0, 10000, 100000, 1000000, 1000000, 15000000, "300M", "1B"],
=======
    
      var  show = ["< 10,000","10,000+", "100,000+", "1M+", "10M+","100M+","200M +","1B +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              mhis = [0, 10000, 100000, 1000000, 10000000, 100000000, 200000000, 1000000000],
>>>>>>> cb732c921ae2da713bf9ea8654f3b9db419a4b03
              labels = [],
              from, to;
          for (var i = 0; i < mhis.length; i++) {
              from = mhis[i];
<<<<<<< HEAD
              to = mhis[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  from + (to ? '&ndash;' + to : '+'));
=======

              to = mhis[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  show[i] ); // + (to ? '&ndash;' + to : '+')
>>>>>>> cb732c921ae2da713bf9ea8654f3b9db419a4b03
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(myMap);  
<<<<<<< HEAD
=======
      
>>>>>>> cb732c921ae2da713bf9ea8654f3b9db419a4b03
  });
});