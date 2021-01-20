  // inside tab
  !(function (d3) {

    $("bcontent").empty();
    var content = d3.select("bcontent");
    // Map
    content.append("div")
           .attr("class", "map")
           .attr("id", "map_density");
           
    // Countries List
    var topCountries = content.append("div")
                              .attr("class","topCountries");                            
            
    var list_heading1 = topCountries.append("h3")
                                    .text("Top 10 Countries in Population Density");
    var top_lists1 = topCountries.append("div")
                                  .attr("class","list-type5")
                                  .append("ol");
  
      // to clear container of map before initializing if already exists
      var container = L.DomUtil.get('map');
      if(container != null){
          container._leaflet_id = null;
      }
  
      // Creating map object
      var map = L.map("map_density", {
        center: [34.0522, 10.2437],
        zoom: 2
      });
  
      // Adding tile layer
      L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 6,
        minZoom: 2,
        id: "light-v10",
        accessToken: API_KEY
      }).addTo(map);     
  
  
      let urlPop = "/api/population/countries";
      // Load in geojson data for marking Countries
      let geoDataURL = "static/data/countries.geojson";
  
        // Grab Countries geo data with d3 from countries geojson
      d3.json(geoDataURL).then(function(data) {
  
        // reading Api json to merge data with geojson
        d3.json(urlPop).then(function(dataPop){
          // Adding Population data into the geojson data
          let popCountriesData = dataPop[0]["data"];
          data.features.forEach(val => {
            for( let i=0; i<popCountriesData.length; i++){
              if(val.id == popCountriesData[i]["Country_Code"]){
                let { properties } = val
                let newProps = { "2020": popCountriesData[i]["2020"], 
                                "Density": popCountriesData[i]["Density"], 
                                "GrowthRate": popCountriesData[i]["GrowthRate"],
                                "rank": popCountriesData[i]["rank"]
                              }
                val.properties = { ...properties, ...newProps }            
              }  
            }
          })
  
        // creating a list of Top 10 Countries in population Density
        popCountriesData.sort(function(a, b) {
          return b.Density - a.Density;
        }); // Sort by rank (descending)
        for(let i=0; i<10; i++){
          top_lists1.append("li")
                    .html("<span class='cname'>" + popCountriesData[i]["Country"] + " :</span> " + formatNumber(popCountriesData[i]["Density"]));
        }
  
      }); 
  
     
  
      function getColor(d) {
        return d > 5000 ? '#990000' :
                d > 1000  ? '#d7301f' :
                d > 100  ? '#ef6548' :
                d > 80  ? '#fc8d59' :
                d > 40   ? '#fdbb84' :
                d > 20  ? '#fdd49e' :
                d > 10   ? '#fee8c8' :
                              '#fff7ec';
      }
      
      function style(feature) {
        return {
            fillColor: getColor(feature.properties.Density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
      }
  
      var info = L.control();
      // control that shows state info on hover
      info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
      };
      info.update = function (props) {
          this._div.innerHTML = '<h4>2019 Population Density</h4>' +  (props ?
                '<b> Country: ' + props.name + '<br>Density: ' + props.Density + '</b><br>Population: ' + formatNumber(props["2020"]) + 
                '<br>Growth rate: ' + props.GrowthRate + '<br>Total Population Rank: ' + props.rank + '<br>'
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
      geojson = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(map);
      info.addTo(map);
          
      var  show = ["< 10/km²","10/km² +", "20/km² +", "40/km² +", "80/km² +","100/km² +","1000/km² +","5000/km² +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend'),
              popul = [0, 10, 50, 100, 200, 500, 1000, 5000],
              labels = [],
              from, to;
          for (var i = 0; i < popul.length; i++) {
              from = popul[i];
      
              to = popul[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  show[i] );
          }
              div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(map);
            
    });
    
  })(d3);