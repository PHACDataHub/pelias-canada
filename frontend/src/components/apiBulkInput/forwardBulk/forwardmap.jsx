import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import { Style, Circle, Fill, Stroke } from "ol/style";
import MapData from "./map/MapData.json";
import { useTranslation } from "react-i18next";

export default function Mapping() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const overlayRef = useRef(null);

  // Responsive State for Wide Screen Check
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080);

  // Add Legend
  const addLegend = (t, isWideScreen) => {
    const legendContainer = document.createElement("div");
    legendContainer.style.position = "absolute"; // Set absolute positioning
    legendContainer.style.bottom = "10px"; // Distance from the bottom of the map
    legendContainer.style.right = "10px"; // Distance from the right of the map
    legendContainer.style.width = "150px";
    legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    legendContainer.style.padding = "5px";
    legendContainer.style.borderRadius = "5px";
    legendContainer.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
    legendContainer.style.fontSize = isWideScreen ? "16px" : "12px";
    legendContainer.style.lineHeight = "1.5em";
    legendContainer.style.zIndex = 10; // Ensure it's above other map elements

    // Add legend title
    legendContainer.innerHTML = `<strong>${t("legend.confidence")}</strong> <br />`;

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

  // Handle Media Query Changes for Screen Width
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1080px)");
    const handleMediaChange = () => setIsWideScreen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const vectorSource = new VectorSource();

    // Function to determine color based on confidence level
    const getColorByConfidence = (confidence) => {
      if (!confidence || typeof confidence !== "string") return "#B22222"; // Default color

      const confidenceValue = parseInt(confidence.replace("%", ""), 10);

      if (confidenceValue >= 100) return "#006400"; // Dark Green
      if (confidenceValue >= 80) return "#389638"; // Green
      if (confidenceValue >= 50) return "#FFBF00"; // Gold
      if (confidenceValue >= 30) return "#FF8C00"; // Dark Orange
      return "#B22222"; // Firebrick Red (for low confidence levels)
    };

    // Add points from MapData
    MapData.forEach((item) => {
      const confidenceColor = getColorByConfidence(item["Confidence Level"]);
      const pointFeature = new Feature({
        geometry: new Point(fromLonLat([item.Longitude, item.Latitude])),
        data: item, // Attach data for hover display
      });
      pointFeature.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: confidenceColor }),
            stroke: new Stroke({ color: "black", width: 1 }),
          }),
        })
      );
      vectorSource.addFeature(pointFeature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Create the map
    const map = new Map({
      view: new View({
        center: fromLonLat([-73.568439, 45.494728]), // Set to Montreal for example
        zoom: 6, // Reasonable zoom level
      }),
      layers: [
        new TileLayer({
          source: new OSM({
						attributions: false, // Disable attribution
					}),
				}),
        vectorLayer,
      ],
      target: mapRef.current,
    });

    // Add Legend to map container
    const legend = addLegend(t, isWideScreen);
    mapRef.current.appendChild(legend); // Append the legend as a child of the map container

    // Create the overlay for hover display
    const overlay = new Overlay({
      element: overlayRef.current,
      positioning: "bottom-center",
      stopEvent: false,
    });
    map.addOverlay(overlay);

    // Show overlay on hover
    map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinates);

        const data = feature.get("data");
        overlayRef.current.style.display = "block"; // Show the overlay
        overlayRef.current.innerHTML = `
          <div>
            <strong>Input ID:</strong> ${data.InputID} <br />
            <strong>Physical Address:</strong> ${data.PhysicalAddress} <br />
            <strong>Latitude:</strong> ${data.Latitude} <br />
            <strong>Longitude:</strong> ${data.Longitude} <br />
            <strong>Confidence Level:</strong> ${data["Confidence Level"]} <br />
            <strong>Match Type:</strong> ${data["Match Type"]} <br />
            <strong>Accuracy:</strong> ${data.Accuracy} <br />
          </div>
        `;
      } else {
        overlay.setPosition(undefined); // Hide the overlay if no feature is hovered over
        overlayRef.current.style.display = "none"; // Ensure the overlay is hidden
      }
    });

    // Cleanup on component unmount
    return () => {
      map.setTarget(null);
      if (legend.parentNode) {
        legend.parentNode.removeChild(legend); // Clean up the legend on unmount
      }
    };
  }, [isWideScreen]);

  return (
    <>
      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: isWideScreen ? "500px" : "250px", // Adjust height dynamically
          position: "relative", // Ensure child elements (e.g., legend) position correctly
          
        }}			role="region" // Defines it as a landmark region
        aria-label={t("components.map.aria")} // Descriptive label for screen readers
        tabIndex="0" // Allows keyboard focus
      ></div>

      {/* Overlay for hover display */}
      <div
        ref={overlayRef}
        style={{
          position: "relative",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "3px",
          padding: "2px",
          pointerEvents: "none",
          fontSize: isWideScreen ? "12px" : "8px",
          lineHeight: "1",
          width: "200px",
          display: "none", // Initially hidden
        }}
      ></div>
    </>
  );
}
