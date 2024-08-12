import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { useEffect } from "react";
import "ol/ol.css"; // Import OpenLayers CSS for styling
import Map from "ol/Map"; // Import Map class from OpenLayers
import View from "ol/View"; // Import View class from OpenLayers
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"; // Import TileLayer and VectorLayer classes from OpenLayers
import { OSM, Vector as VectorSource } from "ol/source"; // Import OSM and VectorSource classes from OpenLayers
import Feature from "ol/Feature"; // Import Feature class from OpenLayers
import Point from "ol/geom/Point"; // Import Point geometry class from OpenLayers
import { fromLonLat } from "ol/proj"; // Import fromLonLat function from OpenLayers for coordinate conversion
import { Style, Circle, Fill, Stroke } from "ol/style"; // Import Style, Circle, Fill, and Stroke classes from OpenLayers for styling

// Function to determine marker color based on confidence level
const getColorForConfidence = (confidence) => {
  if (confidence >= 85) {
    return "green";
  } else if (confidence >= 51) {
    return "yellow";
  } else {
    return "red";
  }
};

// Function to add a legend inside the map div
const addLegend = () => {
  const legendContainer = document.createElement("div");
  legendContainer.className = "ol-legend";
  legendContainer.style.position = "absolute";
  legendContainer.style.bottom = "30px";
  legendContainer.style.right = "10px";
  legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  legendContainer.style.padding = "10px";
  legendContainer.style.borderRadius = "5px";
  legendContainer.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
  legendContainer.style.fontSize = "14px";
  legendContainer.style.lineHeight = "1.5em";

  // Add legend title
  legendContainer.innerHTML = "<strong>Confidence</strong><br>";

  // Define the grades and corresponding colors
  const grades = [0, 30, 50, 80, 99]
  const colors = ["red", "orange","yellow", "lightgreen","green"];
  let labels = [];

  // Create legend items
  for (let i = 0; i < grades.length; i++) {
    labels.push(
      `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ${
        grades[i]
      }% ${i < grades.length - 1 ? "&ndash;" + grades[i + 1] + "%" : "+"}`
    );
  }

  // Add labels to the legend
  legendContainer.innerHTML += labels.join("<br>");

  return legendContainer;
};

const MapComponentOL = ({ mapContentJSON }) => {
  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-95, 60]), // Initial center for Canada
        zoom: 6, // Initial zoom level
      }),
    });

    // Add the markers to the map
    mapContentJSON.forEach((pointString) => {
      const [longitude, latitude, confidence] = pointString.split(",");
      const coordinates = fromLonLat([parseFloat(longitude), parseFloat(latitude)]);
      const conf = parseFloat(confidence);

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: getColorForConfidence(conf) }),
            stroke: new Stroke({ color: "#000", width: 1 }),
          }),
        })
      );

      vectorSource.addFeature(marker);
    });

    // Fit the map view to the extent of all the markers
    const extent = vectorSource.getExtent();
    map.getView().fit(extent, { maxZoom: 14, padding: [50, 50, 50, 50] });

    // Add the legend to the map div
    const mapElement = document.getElementById("map");
    const legend = addLegend();
    mapElement.appendChild(legend);

    return () => {
      map.setTarget(null);
      mapElement.removeChild(legend); // Clean up the legend on unmount
    };
  }, [mapContentJSON]);

  return (
    <div id="map" style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* This div is where the OpenLayers map will be rendered */}
    </div>
  );
};

// PropTypes validation for mapContentJSON
MapComponentOL.propTypes = {
  mapContentJSON: PropTypes.array.isRequired,
};

export default MapComponentOL;
