    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jcianci1/ckkogww9116kb17piisx51qwh', // stylesheet location
      center: recipe.geometry.coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(recipe.geometry.coordinates)
    .addTo(map)