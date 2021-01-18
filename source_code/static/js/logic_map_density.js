let urlPop = "/api/population/countries";
// Load in geojson data for marking Countries
let geoDataURL = "static/data/countries.geojson";



// // Creating map object
// var myMap = L.map("map", {
//   center: [34.0522, -118.2437],
//   zoom: 8
// });

// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// }).addTo(myMap);

// var geojson;

// // Grab data with d3
// d3.json(geoDataURL, function(data) {

//       // reading Api json to merge data with geojson
//       d3.json(urlPop).then(function(dataPop){
//         // Adding Population data into the geojson data
//         let popCountriesData = dataPop[0]["data"];
//         let key = "Density";
//         data.features.forEach(val => {
//           for( let i=0; i<popCountriesData.length; i++){
//             if(val.id == popCountriesData[i]["Country_Code"]){
//               let { properties } = val
//               let newProps = { key: popCountriesData[i][key] }
//               val.properties = { ...properties, ...newProps }
//             }  
//           }
//         })
//       });
      

//   // Create a new choropleth layer
//   geojson = L.choropleth(data, {

//     // Define what  property in the features to use
//     valueProperty: "Density",

//     // Set color scale
//     scale: ["#ffffb2", "#b10026"],

//     // Number of breaks in step range
//     steps: 10,

//     // q for quartile, e for equidistant, k for k-means
//     mode: "q",
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },

//     // Binding a pop-up to each layer
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//         "$" + feature.properties.MHI2016);
//     }
//   }).addTo(myMap);

//   // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);

// });







  // Grab Countries geo data with d3 from countries geojson
  d3.json(geoDataURL).then(function(data) {

    // reading Api json to merge data with geojson
    d3.json(urlPop).then(function(dataPop){
      // Adding Population data into the geojson data
      let popCountriesData = dataPop[0]["data"];
      let key = "Density";
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


      // Creating map object
  var myMap = L.map("map", {
    center: [34.0522, 10.2437],
    zoom: 2
  });

    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);
    

    function getColor(d) {
      return d > 130 ? '#034E7B' :
             d > 100  ? '#0570B0' :
             d > 90  ? '#3690C0' :
             d > 50  ? '#74A9CF' :
             d > 30   ? '#A6BDDB' :
             d > 20  ? '#D0D1E6' :
             d > 10   ? '#ECE7F2' :
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
    
      var  show = ["< 10,000","10,000+", "100,000+", "1M+", "10M+","100M+","200M +","1B +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              mhis = [0, 10, 20, 30, 50, 90, 100, 130],
              labels = [],
              from, to;
          for (var i = 0; i < mhis.length; i++) {
              from = mhis[i];

              to = mhis[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  show[i] ); // + (to ? '&ndash;' + to : '+')
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(myMap);  
      
  });