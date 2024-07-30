import { useState, useEffect, useRef } from "react"
import L from "leaflet"
import JSZip from "jszip"
import CryptoJS from "crypto-js"
import "leaflet/dist/leaflet.css"
import "./reverseBulk.css"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import Loading from "../Loading"

const ReverseBulk = () => {
	const [file, setFile] = useState(null)
	const [outputRows, setOutputRows] = useState([])
	// eslint-disable-next-line no-unused-vars
	const [metadata, setMetadata] = useState({})
	const [progress, setProgress] = useState(0)
	const processButtonRef = useRef(null)
	const mapRef = useRef(null)
	const mapInstanceRef = useRef(null)
	const markersLayerRef = useRef(null)
	const [loading, setLoading] = useState(false)
	const [mapReady, setMapReady] = useState(false)
	const [userCadidatesSelection, setuserCadidatesSelection] = useState(5)
	const [originalRows, setOriginalRows] = useState([])

	// Initial coordinates
	const initialLatLng = [45.4215, -75.6919]

	// Initialize map
	useEffect(() => {
		const initializeMap = () => {
			if (mapRef.current && !mapInstanceRef.current) {
				try {
					mapInstanceRef.current = L.map(mapRef.current).setView(initialLatLng, 13)
					L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					}).addTo(mapInstanceRef.current)

					// Add initial marker with blue color
					L.circleMarker(initialLatLng, {
						radius: 10,
						fillColor: "#0000ff", // Blue color
						color: "#fff",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,
					})
						.bindPopup(`<strong>Initial Location</strong><br>Coordinates: ${initialLatLng[0]}, ${initialLatLng[1]}`)
						.addTo(mapInstanceRef.current)
				} catch (error) {
					console.error("Error initializing the map:", error)
				}
			}
		}

		initializeMap()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Handle file upload
	const handleFileUpload = event => {
		setFile(event.target.files[0])
	}

	// Read and process CSV file
	useEffect(() => {
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const csvContent = e.target.result
				const rows = csvContent
					.split("\n")
					.map(row => row.trim())
					.filter(row => row.length > 0)

				if (rows.length === 0) {
					alert("The CSV file is empty.")
					return
				}

				const headers = rows[0].split(",").map(header => header.trim())
				const requiredColumns = ["inputID", "ddLat", "ddLong"]
				const hasRequiredColumns = requiredColumns.every(column => headers.includes(column))

				if (hasRequiredColumns) {
					setOriginalRows(rows.slice(1))
					if (processButtonRef.current) {
						processButtonRef.current.disabled = false
						processButtonRef.current.addEventListener("click", () => processCSV(rows, headers))
					}
				} else {
					alert("The CSV file is missing required columns: inputID, ddLat, ddLong")
				}
			}

			reader.readAsText(file)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file])

	// Reverse geocode function
	const reverseGeocode = async (lat, lon) => {
		const base_url = "https://geocoder.alpha.phac.gc.ca/api/v1/reverse?"
		const params = new URLSearchParams({
			"point.lat": lat,
			"point.lon": lon,
		})

		try {
			const response = await fetch(base_url + params)
			if (!response.ok) {
				throw new Error("Failed to fetch geocoding data.")
			}
			const data = await response.json()
			return data
		} catch (error) {
			console.error("Error in reverse geocoding:", error)
			return null
		}
	}

	// Process CSV file
	const processCSV = async (rows, headers) => {
		const epochInitiated = Date.now()
		setProgress(0)
		setLoading(true)

		if (!mapInstanceRef.current) {
			alert("Map is not initialized yet.")
			setLoading(false)
			return
		}

		const latIndex = headers.indexOf("ddLat")
		const lonIndex = headers.indexOf("ddLong")
		const inputIDIndex = headers.indexOf("inputID")

		if (latIndex === -1 || lonIndex === -1 || inputIDIndex === -1) {
			alert("The CSV file is missing required columns: inputID, ddLat, ddLong")
			setLoading(false)
			return
		}

		if (markersLayerRef.current) {
			mapInstanceRef.current.removeLayer(markersLayerRef.current)
		}
		markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)

		const newMetadata = {
			epochInitiated: epochInitiated,
			coordinateSystem: "WGS 1984",
			accurateMatchScores: {
				"0-0.3": 0,
				"0.3-0.5": 0,
				"0.5-0.8": 0,
				"0.8-0.99": 0,
				"1.0": 0,
			},
			totalRowsProcessed: 0,
		}
		setMetadata(newMetadata)

		const newOutputRows = []
		const latLngBounds = []

		for (let i = 1; i < rows.length; i++) {
			const row = rows[i]
			const columns = row.split(",").map(col => col.trim())

			const lat = parseFloat(columns[latIndex])
			const lon = parseFloat(columns[lonIndex])
			const inputID = columns[inputIDIndex]

			if (isNaN(lat) || isNaN(lon)) {
				continue
			}

			L.circleMarker([lat, lon], {
				radius: 10,
				fillColor: "#007bff",
				color: "#fff",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8,
			})
				.bindPopup(`<strong>Input ID: ${inputID}</strong><br>Coordinates: ${lat}, ${lon}`)
				.addTo(markersLayerRef.current)

			const geoData = await reverseGeocode(lat, lon)

			const maxCandidates = userCadidatesSelection
			const prioritizedData = geoData.features.slice(0, maxCandidates)

			if (prioritizedData.length > 0) {
				prioritizedData.sort((a, b) => {
					if (a.properties.confidence !== b.properties.confidence) {
						return b.properties.confidence - a.properties.confidence
					}
					return a.properties.distance - b.properties.distance
				})

				prioritizedData.forEach((feature, index) => {
					newOutputRows.push({
						inputID: inputID,
						lat: lat,
						lon: lon,
						ddLatOut: feature.geometry.coordinates[1],
						ddLongOut: feature.geometry.coordinates[0],
						matchConfidencePercentageDecimal: feature.properties.confidence || "",
						distanceKm: feature.properties.distance || "",
						accuracy: feature.properties.accuracy || "",
						country: feature.properties.country || "",
						region: feature.properties.region || "",
						region_a: feature.properties.region_a || "",
						county: feature.properties.county || "",
						locality: feature.properties.locality || "",
						neighbourhood: feature.properties.neighbourhood || "",
						rankingByInputId: index + 1,
						name: feature.properties.name || "",
						housenumber: feature.properties.housenumber || "",
						streetName: feature.properties.street || "",
						labelFullCivicAddress: feature.properties.label || "",
					})

					if (feature.properties.confidence <= 0.3) newMetadata.accurateMatchScores["0-0.3"]++
					else if (feature.properties.confidence <= 0.5) newMetadata.accurateMatchScores["0.3-0.5"]++
					else if (feature.properties.confidence <= 0.8) newMetadata.accurateMatchScores["0.5-0.8"]++
					else if (feature.properties.confidence < 1.0) newMetadata.accurateMatchScores["0.8-0.99"]++
					else newMetadata.accurateMatchScores["1.0"]++

					const marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
						radius: 8,
						fillColor: calculateMarkerColor(feature.properties.confidence),
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,
					})

					marker
						.bindPopup(`<strong>${feature.properties.name || "Unknown"}</strong><br>Confidence: ${feature.properties.confidence}<br>Distance: ${feature.properties.distance}`)
						.addTo(markersLayerRef.current)

					latLngBounds.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
				})

				newMetadata.totalRowsProcessed++
			}

			setProgress((i / rows.length) * 100)
		}

		setOutputRows(newOutputRows)
		setMetadata(newMetadata)

		if (latLngBounds.length > 0) {
			mapInstanceRef.current.fitBounds(latLngBounds)
		}

		const csvData = convertArrayToCSV(newOutputRows)
		const geoJsonData = convertArrayToGeoJSON(newOutputRows) // Generate GeoJSON data
		const md5Checksum = CryptoJS.MD5(csvData).toString()
		createAndDownloadZip(csvData, JSON.stringify(newMetadata, null, 2), geoJsonData, epochInitiated, md5Checksum) // Pass GeoJSON data to the ZIP function
		setLoading(false)
		setProgress(100)
		setMapReady(true)
	}

	// Calculate marker color based on confidence
	const calculateMarkerColor = confidence => {
		if (confidence < 0.3) return "#ff0000"
		if (confidence < 0.5) return "#ff8000"
		if (confidence < 0.8) return "#ffff00"
		if (confidence < 1.0) return "#80ff00"
		return "#00ff00"
	}

	// Convert array of objects to CSV
	const convertArrayToCSV = data => {
		const header = [
			"inputID",
			"lat",
			"lon",
			"ddLatOut",
			"ddLongOut",
			"matchConfidencePercentageDecimal",
			"distanceKm",
			"accuracy",
			"country",
			"region",
			"region_a",
			"county",
			"locality",
			"neighbourhood",
			"rankingByInputId",
			"name",
			"housenumber",
			"streetName",
			"labelFullCivicAddress",
		]

		const rows = [header.join(",")]
		data.forEach(row => {
			const values = header.map(fieldName => JSON.stringify(row[fieldName] || ""))
			rows.push(values.join(","))
		})

		return rows.join("\n")
	}

	const convertArrayToGeoJSON = array => {
		// Log the originalRows data to check its format
		console.log("Original Rows Data:", originalRows)

		// Create a map from inputID to original latitude and longitude
		const originalCoordsMap = new Map(
			originalRows.map(row => {
				const [inputID, lat, lon] = row.split(",").map(value => value.trim())
				const parsedLat = parseFloat(lat)
				const parsedLon = parseFloat(lon)
				return [inputID, { lat: isNaN(parsedLat) ? null : parsedLat, lon: isNaN(parsedLon) ? null : parsedLon }]
			})
		)

		console.log("Original Coordinates Map:", Array.from(originalCoordsMap.entries()))

		const geojson = {
			type: "FeatureCollection",
			features: array.map(row => {
				// Find the original coordinates for the current inputID
				const originalCoords = originalCoordsMap.get(row.inputID) || { lat: null, lon: null }

				console.log(`Processing row with inputID ${row.inputID}:`, {
					originalCoords,
					row,
				})

				return {
					type: "Feature",
					properties: {
						inputID: row.inputID,
						matchConfidencePercentageDecimal: row.matchConfidencePercentageDecimal,
						originalLatitude: row.lat,
						originalLongitude: row.lon,
						distanceKm: row.distanceKm,
						accuracy: row.accuracy,
						country: row.country,
						region: row.region,
						region_a: row.region_a,
						county: row.county,
						locality: row.locality,
						neighbourhood: row.neighbourhood,
						rankingByInputId: row.rankingByInputId,
						name: row.name,
						housenumber: row.housenumber,
						streetName: row.streetName,
						labelFullCivicAddress: row.labelFullCivicAddress,
					},
					geometry: {
						type: "Point",
						coordinates: [row.ddLongOut, row.ddLatOut],
					},
				}
			}),
		}

		console.log("Generated GeoJSON:", geojson)

		return geojson
	}

	// Create and download zip file
	const createAndDownloadZip = (csvData, metadataJson, geoJsonData, epoch, checksum) => {
		const zip = new JSZip()
		zip.file("data.csv", csvData)
		zip.file("metadata.json", metadataJson)
		zip.file("data.geojson", JSON.stringify(geoJsonData, null, 2)) // Adding GeoJSON file
		zip.file("checksum.md5", checksum)

		zip.generateAsync({ type: "blob" }).then(content => {
			const a = document.createElement("a")
			a.href = URL.createObjectURL(content)
			a.download = `reverse-geocoding-results-${epoch}.zip`
			a.click()
		})
	}

	const handleSliderChange = event => {
		setuserCadidatesSelection(Number(event.target.value))
	}

	return (
		<div className="reverse-bulk-container">
			<input type="file" accept=".csv" onChange={handleFileUpload} />
			<div>
				<fieldset>
					<label htmlFor="candidate-slider">Select Number of Candidates:</label>
					<br />
					<input id="candidate-slider" type="range" min="2" max="10" step="1" value={userCadidatesSelection} onChange={handleSliderChange} style={{ width: "100px" }} />
					Value: {userCadidatesSelection}
				</fieldset>
			</div>
			<GcdsButton size="small" disabled={!file} ref={processButtonRef}>
				REVERSE GEOCODE
			</GcdsButton>

			<br />
			<br />
			<div
				id="map"
				ref={mapRef}
				className="map-container"
				style={{
					height: "1px",
					width: "1px",
					position: "absolute", // Ensure it's removed from normal document flow
					overflow: "hidden", // Hide any overflow content
					clip: "rect(0, 0, 0, 0)", // Hide content but keep the space in the DOM
					clipPath: "inset(50%)", // Alternative method to clip content
				}}
				aria-hidden="true" // Hide from screen readers
				tabIndex="-1" // Hide from tab navigation
			/>
			{loading && progress === 0 && (
				<div className="loading">
					<Loading />
				</div>
			)}
			{progress > 0 && progress < 100 && <progress value={progress / 100} />}

			{mapReady && !loading && progress <= 100 && (
				<div style={{ height: "600px", width: "100%" }}>
					<MapContainer center={initialLatLng} zoom={3} style={{ height: "100%" }}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						{originalRows.map((row, index) => {
							// Split the row by commas to get individual values
							const [item1, item2, item3] = row.split(",").map(value => parseFloat(value))

							return (
								<div key={index}>
									<CircleMarker
										key={index}
										center={[item2, item3]}
										color="blue"
										radius={5}
										pathOptions={{
											fillColor: "blue", // Fill color based on confidence
											color: "black", // Stroke color
											weight: 1, // Stroke width
											opacity: 1, // Stroke opacity
											fillOpacity: 0.8, // Fill opacity
										}}
									>
										<Popup>
											<div style={{ lineHeight: 0.1 }}>
												<p>Row ID: {item1} </p>
												<p>lat: {item2} </p>
												<p>long: {item3}</p>
											</div>
										</Popup>
									</CircleMarker>
								</div>
							)
						})}
						{outputRows.map((row, index) => (
							<CircleMarker
								key={index}
								center={[row.ddLatOut, row.ddLongOut]}
								color={calculateMarkerColor(row.matchConfidencePercentageDecimal)}
								radius={5}
								pathOptions={{
									fillColor: calculateMarkerColor(row.matchConfidencePercentageDecimal), // Fill color based on confidence
									color: "black", // Stroke color
									weight: 1, // Stroke width
									opacity: 1, // Stroke opacity
									fillOpacity: 0.8, // Fill opacity
								}}
							>
								<Popup>
									<div style={{ lineHeight: 0.1, width: "auto" }}>
										<p>
											<strong>
												{row.name && <>{row.name}</>}, {row.name && <> {row.locality} </>}, {row.name && <> {row.region} </>}
											</strong>
										</p>
										<p>
											Row ID & Ranking: {row.inputID} - #{row.rankingByInputId}
										</p>
										<p>Confidence: {row.matchConfidencePercentageDecimal * 100}%</p>
										<p>Distance from original: {row.distanceKm} km</p>
										{row.name && <p>Street name: {row.name} </p>}
										{row.name && <p>Locality : {row.locality} </p>}
										{row.name && <p>Province: {row.region} </p>}
										{row.name && <p>Accuracy: {row.accuracy}</p>}
									</div>
								</Popup>
							</CircleMarker>
						))}
					</MapContainer>
				</div>
			)}
		</div>
	)
}

export default ReverseBulk
