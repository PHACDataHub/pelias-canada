import React, { useEffect, useRef, useState } from "react"
import Map from "ol/Map.js"
import View from "ol/View.js"
import TileLayer from "ol/layer/Tile.js"
import OSM from "ol/source/OSM.js"
import { fromLonLat } from "ol/proj"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import Overlay from "ol/Overlay"
import { Style, Circle, Fill, Stroke } from "ol/style"
import { useTranslation } from "react-i18next"

export default function Mapping({ apiResults }) {
	const { t } = useTranslation()
	const mapRef = useRef(null)
	const overlayRef = useRef(null)

	// Responsive State for Wide Screen Check
	const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080)

	// Handle Media Query Changes for Screen Width
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1080px)")
		const handleMediaChange = () => setIsWideScreen(mediaQuery.matches)

		mediaQuery.addEventListener("change", handleMediaChange)
		return () => mediaQuery.removeEventListener("change", handleMediaChange)
	}, [])

	useEffect(() => {
		const vectorSource = new VectorSource()
		const features = []

		// Function to determine color based on confidence level
		const getColorByConfidence = confidence => {
			if (!confidence || typeof confidence !== "number") return "#B22222"
			const confidenceValue = confidence * 100 // Convert to percentage
			if (confidenceValue >= 100) return "#006400" // Green
			if (confidenceValue >= 80) return "#389638" // Light Green
			if (confidenceValue >= 50) return "#FFBF00" // Yellow
			if (confidenceValue >= 30) return "#FF8C00" // Orange
			return "#B22222" // Red for low confidence
		}

		// Add points from apiResults
		apiResults.forEach(item => {
			const confidence = item?.result?.features?.[0]?.properties?.confidence
			const confidenceColor = getColorByConfidence(confidence)

			const pointFeature = new Feature({
				geometry: new Point(fromLonLat([item?.result?.features?.[0]?.geometry?.coordinates?.[0], item?.result?.features?.[0]?.geometry?.coordinates?.[1]])),
				data: item,
			})

			pointFeature.setStyle(
				new Style({
					image: new Circle({
						radius: 5, // You can adjust the radius if you want it to vary based on confidence
						fill: new Fill({ color: confidenceColor }), // Color based on confidence
						stroke: new Stroke({ color: "black", width: 1 }),
					}),
				})
			)

			vectorSource.addFeature(pointFeature)
			features.push(pointFeature)
		})

		const vectorLayer = new VectorLayer({ source: vectorSource })

		// Create the map
		const map = new Map({
			view: new View({
				center: fromLonLat([-73.568439, 45.494728]), // Default to Montreal
				zoom: 6,
			}),
			layers: [
				new TileLayer({
					source: new OSM({ attributions: false }),
				}),
				vectorLayer,
			],
			target: mapRef.current,
		})

		// Fit map to all points
		if (features.length > 0) {
			const extent = vectorSource.getExtent()
			map.getView().fit(extent, {
				size: map.getSize(),
				padding: [50, 50, 50, 50],
				maxZoom: 14,
			})
		}

		// Create overlay for hover display
		const overlay = new Overlay({
			element: overlayRef.current,
			positioning: "bottom-center",
			stopEvent: false,
		})
		map.addOverlay(overlay)

		map.on("pointermove", event => {
			const feature = map.forEachFeatureAtPixel(event.pixel, feat => feat)
			if (feature) {
				const coordinates = feature.getGeometry().getCoordinates()
				overlay.setPosition(coordinates)

				const data = feature.get("data")
				overlayRef.current.style.display = "block"
				overlayRef.current.innerHTML = `
     
          <div>
            <strong>${t("components.forwardBulk.mapReady.outputTable.inputID")}:</strong> ${data.inputID} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.address")}:</strong> ${data?.result?.geocoding?.query?.text || "N/A"} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.lat")}:</strong> ${data?.result?.features?.[0]?.geometry?.coordinates?.[1] ?? "N/A"} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.lon")}:</strong> ${data?.result?.features?.[0]?.geometry?.coordinates?.[0] ?? "N/A"} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.confidenceLevel")}:</strong> ${data?.result?.features?.[0]?.properties?.confidence !== undefined ? `${data.result.features[0].properties.confidence * 100}%` : "N/A"} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.matchType")}:</strong> ${data?.result?.features?.[0]?.properties?.match_type || "N/A"} <br />
            <strong>${t("components.forwardBulk.mapReady.outputTable.accuracy")}:</strong> ${data?.result?.features?.[0]?.properties?.accuracy || "N/A"} <br />
  
          </div>
        `
			} else {
				overlay.setPosition(undefined)
				overlayRef.current.style.display = "none"
			}
		})

		// Cleanup
		return () => {
			map.setTarget(null)
		}
	}, [t, isWideScreen, apiResults])

	return (
		<>
			{apiResults.length > 0 && (
				<>
					{/* Map Container */}
					<div
						ref={mapRef}
						style={{
							width: "100%",
							height: isWideScreen ? "500px" : "250px",
							position: "relative",
						}}
						role="region"
						aria-label={t("components.map.aria")}
						tabIndex="0"
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
							display: "none",
						}}
					></div>
				</>
			)}
		</>
	)
}
