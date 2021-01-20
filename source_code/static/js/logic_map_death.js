let urlPop = "/api/population/death";
// Load in geojson data for marking Countries
let geoDataURL = "/static/data/countries.geojson";


  // Grab Countries geo data with d3 from countries geojson
  d3.json(geoDataURL).then(function(data) {
    console.log(data);
    // reading Api json to merge data with geojson
    d3.json(urlPop).then(function(dataPop){
      console.log(dataPop);
      // Adding Population data into the geojson data
      let popCountriesData = dataPop[0]["data"];
      let key = "2018";
      data.features.forEach(val => {
        for( let i=0; i<popCountriesData.length; i++){
          if(val.id == popCountriesData[i]["Country_Code"]){
            let { properties } = val
            let newProps = { key: popCountriesData[i][key] }
            val.properties = { ...properties, ...newProps }
          } 
          console.log(val);
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
      return d > 15 ? '#f50202' :
             d > 13  ? '#a11010' :
             d > 11  ? '#701f1f' :
             d > 9  ? '#854040' :
             d > 6   ? '#b06363' :
             d > 4  ? '#d18484' :
             d > 1   ? '#ad7974' :
                        '#d4cac9';
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
    
      var  show = ["< 1","1+", "4+", "6+", "9+","11+","13 +","15 +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              mhis = [0, 1, 4, 6, 9, 11, 13, 15],
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