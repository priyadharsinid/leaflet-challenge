// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("Magnitude:" +feature.properties.mag+"<br>Depth:"+
    feature.geometry.coordinates[2]+"<br>Location: "+feature.properties.place+
    "<br>Time:"+new Date(feature.properties.time));
    
  };

  function pointToLayer(feature, latlng) {
   
    return L.circleMarker(latlng, {
        radius: setRadius(feature.properties.mag),
        color: "black",
        fillColor: setColors(feature.geometry.coordinates[2]),
        fillOpacity: 0.5
      });


  };

  function setRadius(mag) {

   
    if ( mag === 0) {
        return 3;
    }
    
  
    else {
        return mag*3;
    }
};

  function setColors(depth) {
    return depth > 90
    ? "#ea2c2c"
    : depth > 70
    ? "#ea5f2c"
    : depth > 50
    ? "#eabb2c"
    : depth > 30
    ? "#eada2c"
    : depth > 10
    ? "#eae72c"
    : "#caea2c";

    
  };
        
     
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  
};

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
 var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  createLegend(myMap);

};
function createLegend(myMap) {
    

    var legend =L.control({
        position: "bottomright"
    });
    legend.onAdd= function(){
        var div = L.DomUtil.create("div", "legend");
        var magnitudes = [-10, 10, 30, 50, 70, 90];
        var colors = ["#caea2c","#eae72c","#eada2c","#eabb2c","#ea5f2c","#ea2c2c"];
    
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
              '<i style="background:' +
              colors[i] +
              '"></i> ' +
              magnitudes[i] +
              (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
          }
        return div;
    };
    legend.addTo(myMap);

};

