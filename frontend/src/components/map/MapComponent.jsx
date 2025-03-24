import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { defaults as defaultControls } from "ol/control";
import ScaleLine from "ol/control/ScaleLine";
import FullScreen from "ol/control/FullScreen";
import { useTranslation } from "react-i18next";

// Function to determine marker color based on confidence level
const getColorForConfidence = (confidence) => {
  if (confidence >= 100) {
    return "#006400";
  } else if (confidence >= 80) {
    return "#389638";
  } else if (confidence >= 50) {
    return "#FFBF00";
  } else if (confidence >= 30) {
    return "#FF8C00";
  } else {
    return "#B22222";
  }
};

// Function to add a legend inside the map div
const addLegend = (t, isWideScreen) => {
  const legendContainer = document.createElement("div");
  legendContainer.style.position = "absolute";
  legendContainer.style.bottom = "30px";
  legendContainer.style.right = "10px";
  legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  legendContainer.style.padding = "5px";
  legendContainer.style.borderRadius = "5px";
  legendContainer.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
  legendContainer.style.fontSize = isWideScreen ? "16px" : "12px";
  legendContainer.style.lineHeight = "1.5em";

  // Add legend title
  legendContainer.innerHTML = `<strong>${t("legend.confidence")}</strong> <br/>`;

  const grades = [100, 80, 50, 30, 0];
  const colors = ["#006400", "#389638", "#FFBF00", "#FF8C00", "#B22222"];

  const labels = grades.map((grade, i) => {
    return `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ${
      grade
    }% ${i < grades.length - 4 ? "+" : `&ndash; ${grades[i - 1]}%`}`;
  });

  legendContainer.innerHTML += labels.join("<br>");
  return legendContainer;
};

function MapComponentOL({ mapContentJSON }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080);
  const { t } = useTranslation();

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: false, // Disable attribution
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-95, 60]), // Initial center for Canada
        zoom: 6, // Initial zoom level
      }),
      controls: defaultControls().extend([
        new ScaleLine(), // Add a scale line control
        new FullScreen(), // Add a full-screen control
      ]),
    });

    mapInstance.current = map;

    mapContentJSON.forEach((pointString) => {
      const [longitude, latitude, confidence] = pointString.split(",");
      const coordinates = fromLonLat([
        parseFloat(longitude),
        parseFloat(latitude),
      ]);
      const conf = parseFloat(confidence);

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: getColorForConfidence(conf) }),
            stroke: new Stroke({ color: "#000", width: 3 }),
          }),
        }),
      );

      vectorSource.addFeature(marker);
    });

    const extent = vectorSource.getExtent();
    map.getView().fit(extent, { maxZoom: 14, padding: [50, 50, 50, 50] });

    const legend = addLegend(t, isWideScreen);
    mapRef.current.appendChild(legend);

    const observer = new ResizeObserver(() => {
      map.updateSize();
    });
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      map.setTarget(null);
      if (legend.parentNode) legend.parentNode.removeChild(legend);
    };
  }, [mapContentJSON, t, isWideScreen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1080px)");
    const handleMediaChange = () => setIsWideScreen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        position: "relative",
        width: "100%",
        height: isWideScreen ? "500px" : "250px", // Adjust height dynamically
      }}
      role="region" // Defines it as a landmark region
      aria-label={t("components.map.aria")} // Descriptive label for screen readers
      tabIndex="0" // Allows keyboard focus
    >
      {/* This div is where the OpenLayers map will be rendered */}
    </div>
  );
}

// PropTypes validation for mapContentJSON
MapComponentOL.propTypes = {
  mapContentJSON: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure it's an array of strings
};

export default MapComponentOL;
