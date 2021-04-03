// mapboxgl.accessToken = mapToken;
// var map = new mapboxgl.Map({
//     container: 'cluster-map',
//     style: 'mapbox://styles/mapbox/dark-v10',
//     center: [-103.59179687498357, 40.66995747013945],
//     zoom: 3
// });

// map.addControl(new mapboxgl.NavigationControl());
 
// map.on('load', function () {
// // Add a new source from our GeoJSON data and
// // set the 'cluster' option to true. GL-JS will
// // add the point_count property to your source data.
//     map.addSource('recipes', {
//     type: 'geojson',
//     // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
//     // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
//         data: recipes,
//         cluster: true,
//         clusterMaxZoom: 14, // Max zoom to cluster points on
//         clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
//         });
        
// map.addLayer({
// id: 'clusters',
// type: 'circle',
// source: 'recipes',
// filter: ['has', 'point_count'],
// paint: {
// // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// // with three steps to implement three types of circles:
// //   * Blue, 20px circles when point count is less than 100
// //   * Yellow, 30px circles when point count is between 100 and 750
// //   * Pink, 40px circles when point count is greater than or equal to 750
//             'circle-color': [
//             'step',
//             ['get', 'point_count'],
//             '#51bbd6',
//             100,
//             '#f1f075',
//             750,
//             '#f28cb1'
//             ],
//             'circle-radius': [
//             'step',
//             ['get', 'point_count'],
//             20,
//             100,
//             30,
//             750,
//             40
//         ]
//     }
// });
 
// map.addLayer({
// id: 'cluster-count',
// type: 'symbol',
// source: 'recipes',
// filter: ['has', 'point_count'],
// layout: {
//     'text-field': '{point_count_abbreviated}',
//     'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
//     'text-size': 12
// }
// });
 
// map.addLayer({
// id: 'unclustered-point',
// type: 'circle',
// source: 'recipes',
// filter: ['!', ['has', 'point_count']],
// paint: {
// 'circle-color': '#11b4da',
// 'circle-radius': 4,
// 'circle-stroke-width': 1,
// 'circle-stroke-color': '#fff'
// }
// });
 
// // inspect a cluster on click
// map.on('click', 'clusters', function (e) {
// var features = map.queryRenderedFeatures(e.point, {
// layers: ['clusters']
// });
// var clusterId = features[0].properties.cluster_id;
// map.getSource('recipes').getClusterExpansionZoom(
// clusterId,
// function (err, zoom) {
// if (err) return;
 
// map.easeTo({
// center: features[0].geometry.coordinates,
// zoom: zoom
// });
// }
// );
// });
 
// // When a click event occurs on a feature in
// // the unclustered-point layer, open a popup at
// // the location of the feature, with
// // description HTML from its properties.
// map.on('click', 'unclustered-point', function (e) {
// const text = e.features[0].properties.popUpMarkup;
// var coordinates = e.features[0].geometry.coordinates.slice();
// // var mag = e.features[0].properties.mag;
// // var tsunami;
 
// // if (e.features[0].properties.tsunami === 1) {
// // tsunami = 'yes';
// // } else {
// // tsunami = 'no';
// // }
 
// // Ensure that if the map is zoomed out such that
// // multiple copies of the feature are visible, the
// // popup appears over the copy being pointed to.
// while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
// coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
// }
 
// new mapboxgl.Popup()
// .setLngLat(coordinates)
// .setHTML(
// text
// )
// .addTo(map);
// });
 
// map.on('mouseenter', 'clusters', function () {
// map.getCanvas().style.cursor = 'pointer';
// });
// map.on('mouseleave', 'clusters', function () {
// map.getCanvas().style.cursor = '';
// });
// });


//----------------------------------------------NEW MAP--------------------------------------------------------//

mapboxgl.accessToken = 'pk.eyJ1IjoiamNpYW5jaTEiLCJhIjoiY2trZWM2anJmMGF4eDJuano1NzZscjA1NSJ9.RabLwj8ALzY2pJbp35s_hA';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/jcianci1/ckkpts1oy2c3j17ovwrybp73t', // style URL
            center: [12.496366, 41.902782], // starting position [lng, lat]
            zoom: 5 // starting zoom
        });

var hoveredReg_istat_code = null;

map.on('load', function () {
// Add the source to query. In this example we're using
// county polygons uploaded as vector tiles
map.addSource('regions', {
'type': 'vector',
'url': 'mapbox://jcianci1.ckkn7626311fq22o2wuxuq1l0-71nfu'
});

map.addLayer({
    'id': 'regions-layer',
    'type': 'fill',
    'source-layer': 'ItalyRegions',
    'source': 'regions',
    'paint': {
        'fill-color': '#888c85',
        'fill-outline-color': '#1f211f',
        'fill-opacity': 0
    }
});

map.addLayer(
    {
        'id': 'regions-highlighted',
        'type': 'fill',
        'source-layer': 'ItalyRegions',
        'source': 'regions',
        'layout': {},
        'paint': {
            'fill-color': '#6e599f',
            'fill-opacity':
                    [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ]
        }
    });

    map.on('mousemove', 'regions-highlighted', function (e) {
        console.log('regions-highlighted')
            if (e.features.length > 0) {
                if (hoveredReg_istat_code) {
                    map.setFeatureState(
                        { source: 'regions', id: hoveredReg_istat_code },
                        { hover: false }
                        );
                    }
                    hoveredReg_istat_code = e.features[0].id;
                    map.setFeatureState(
                        { source: 'regions', id: hoveredReg_istat_code },
                        { hover: true }
                        );
                }
        });
         
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
    map.on('mouseleave', 'regions-highlighted', function () {
                if (hoveredReg_istat_code) {
                map.setFeatureState(
                { source: 'regions', id: hoveredReg_istat_code },
                { hover: false }
                );
                }
                hoveredReg_istat_code = null;
        });
 
// When a click event occurs on a feature in the states layer, open a popup at the
// location of the click, with description HTML from its properties.
// map.on('click', 'regions-layer', function (e) {
// const popupMarkup = e.features[0].properties.reg_name;

//     new mapboxgl.Popup()
//         .setLngLat(e.lngLat)
//         .setHTML(popupMarkup)
//         .addTo(map);
//     });
 
// // Change the cursor to a pointer when the mouse is over the states layer.
// map.on('mouseenter', 'regions-layer', function () {
// map.getCanvas().style.cursor = 'pointer';
// });
 
// // Change it back to a pointer when it leaves.
// map.on('mouseleave', 'regions-layer', function () {
// map.getCanvas().style.cursor = '';
// });

// const popupMarker = e.features[0].properties.reg_name;

// popupMarker.getElement().addEventListener('click', function(e){
//     const derm = e.target.value.toLowerCase();
//     const recipes = document.getElementsByTagName("small")    ;
//         Array.from(recipes).forEach(function(recipe){
//             const title = recipe.textContent;
//             if(title.toLowerCase().indexOf(derm) != -1){
//                 recipe.style.display = 'block';
//             }else {
//                 recipe.style.display = 'none';
//             }
//         })
//     });
});