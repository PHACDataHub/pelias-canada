import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { useEffect } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS for styling
import Map from 'ol/Map'; // Import Map class from OpenLayers
import View from 'ol/View'; // Import View class from OpenLayers
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'; // Import TileLayer and VectorLayer classes from OpenLayers
import { OSM, Vector as VectorSource } from 'ol/source'; // Import OSM and VectorSource classes from OpenLayers
import Feature from 'ol/Feature'; // Import Feature class from OpenLayers
import Point from 'ol/geom/Point'; // Import Point geometry class from OpenLayers
import { fromLonLat } from 'ol/proj'; // Import fromLonLat function from OpenLayers for coordinate conversion
import { Style, Circle, Fill, Stroke } from 'ol/style'; // Import Style, Circle, Fill, and Stroke classes from OpenLayers for styling

// Function to determine marker color based on confidence level
const getColorForConfidence = (confidence) => {
  if (confidence >= 85) {
    return 'green';
  } else if (confidence >= 51) {
    return 'yellow';
  } else {
    return 'red';
  }
};

const MapComponentOL = ({ mapContentJSON }) => {
  useEffect(() => {
    // Create a vector source and layer for markers
    const vectorSource = new VectorSource(); // Instantiate VectorSource for storing marker features
    const vectorLayer = new VectorLayer({ // Instantiate VectorLayer to render vector data
      source: vectorSource // Assign the vector source to the vector layer
    });

    // Initialize the map with an empty view
    const map = new Map({
      target: 'map', // Specify the HTML element ID where the map will be rendered
      layers: [
        new TileLayer({ // Add a TileLayer with OpenStreetMap (OSM) as the tile source
          source: new OSM()
        }),
        vectorLayer // Add the vector layer for displaying markers on top of the base map
      ],
      view: new View({
        center: fromLonLat([-95, 60]), // Set initial center coordinates for Canada in EPSG:3857 projection (Web Mercator)
        zoom: 3 // Set initial zoom level of the map
      })
    });

    // Add markers to the map based on mapContentJSON
    mapContentJSON.forEach((pointString) => {
      const [longitude, latitude, confidence] = pointString.split(','); // Split pointString into longitude, latitude, and confidence
      const coordinates = fromLonLat([parseFloat(longitude), parseFloat(latitude)]); // Convert longitude and latitude to EPSG:3857 coordinates
      const conf = parseFloat(confidence); // Parse confidence value as float

      const marker = new Feature({ // Create a new feature (marker) at the specified coordinates
        geometry: new Point(coordinates) // Set the geometry of the feature as a Point at the converted coordinates
      });

      marker.setStyle(new Style({ // Apply a style to the marker
        image: new Circle({ // Use a Circle as the marker symbol
          radius: 5, // Set the radius of the circle
          fill: new Fill({ color: getColorForConfidence(conf) }), // Set fill color based on confidence level
          stroke: new Stroke({ color: '#000', width: 1 }) // Set stroke style for the circle
        })
      }));

      vectorSource.addFeature(marker); // Add the marker feature to the vector source
    });

    // Wait for the vector source to be ready before fitting the view
    vectorSource.once('change', function() {
      if (vectorSource.getState() === 'ready') { // Check if vector source is in 'ready' state
        // Get the extent (bounding box) of the vector layer
        var extent = vectorSource.getExtent();
        // Fit the view to the extent of the vector source with maxZoom for a closer view
        map.getView().fit(extent, { size: map.getSize(), padding: [50, 50, 50, 50], maxZoom: 14 });
      }
    });

    return () => {
      map.setTarget(null); // Cleanup function to remove map target when component unmounts
    };
  }, [mapContentJSON]); // Dependency array ensures useEffect runs when mapContentJSON changes

  return (
    <div id="map" style={{ width: '100%', height: '500px' }}>
      {/* This div is where the OpenLayers map will be rendered */}
    </div>
  );
};

// PropTypes validation for mapContentJSON
MapComponentOL.propTypes = {
  mapContentJSON: PropTypes.array.isRequired,
};

export default MapComponentOL;
