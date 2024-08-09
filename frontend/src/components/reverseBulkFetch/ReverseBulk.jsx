import { useState, useEffect, useRef } from "react"
import L from "leaflet"
import JSZip from "jszip"
import CryptoJS from "crypto-js"
import "leaflet/dist/leaflet.css"
import "./reverseBulk.css"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { GcdsButton, GcdsGrid } from "@cdssnc/gcds-components-react"
import Loading from "../Loading"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

const ReverseBulk = () => {
	const [file, setFile] = useState(null)
	const [outputRows, setOutputRows] = useState([])
	const [metadata, setMetadata] = useState({})
	const [progress, setProgress] = useState(0)
	const processButtonRef = useRef(null)
	const mapRef = useRef(null)
	const mapInstanceRef = useRef(null)
	const markersLayerRef = useRef(null)
	const [loading, setLoading] = useState(false)
	const [mapReady, setMapReady] = useState(false)
	const [userCandidatesSelection, setuserCandidatesSelection] = useState(5)
	const [originalRows, setOriginalRows] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const resultsTableRef = useRef(null)
	const [totalPages, setTotalPages] = useState(0)

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

	useEffect(() => {
		// Update total pages whenever results or rowsPerPage change
		setTotalPages(Math.ceil(outputRows.length / rowsPerPage))
	}, [outputRows, rowsPerPage])

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

			const maxCandidates = userCandidatesSelection
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
		// Create a map from inputID to original latitude and longitude
		const originalCoordsMap = new Map(
			originalRows.map(row => {
				const [inputID, lat, lon] = row.split(",").map(value => value.trim())
				const parsedLat = parseFloat(lat)
				const parsedLon = parseFloat(lon)
				return [inputID, { lat: isNaN(parsedLat) ? null : parsedLat, lon: isNaN(parsedLon) ? null : parsedLon }]
			})
		)

		return {
			type: "FeatureCollection",
			features: array.map(row => {
				// Find the original coordinates for the current inputID
				const originalCoords = originalCoordsMap.get(row.inputID) || { lat: null, lon: null }

				return {
					type: "Feature",
					properties: {
						inputID: row.inputID,
						matchConfidencePercentageDecimal: row.matchConfidencePercentageDecimal,
						originalLatitude: originalCoords.lat,
						originalLongitude: originalCoords.lon,
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
		setuserCandidatesSelection(Number(event.target.value))
	}

	const count_100 = outputRows.filter(result => result.matchConfidencePercentageDecimal * 100 === 100).length
	const count_80_to_99 = outputRows.filter(result => result.matchConfidencePercentageDecimal * 100 >= 80 && result.matchConfidencePercentageDecimal * 100 < 100).length
	const count_50_to_80 = outputRows.filter(result => result.matchConfidencePercentageDecimal * 100 >= 50 && result.matchConfidencePercentageDecimal * 100 < 80).length
	const count_30_to_50 = outputRows.filter(result => result.matchConfidencePercentageDecimal * 100 >= 30 && result.matchConfidencePercentageDecimal * 100 < 50).length
	const count_0_to_30 = outputRows.filter(result => result.matchConfidencePercentageDecimal * 100 >= 0 && result.matchConfidencePercentageDecimal * 100 < 30).length

	const handleRowsPerPageChange = event => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setCurrentPage(1) // Reset to first page when rows per page changes
	}

	const handlePageChange = event => {
		setCurrentPage(parseInt(event.target.value, 10))
	}

	const [selectedRows, setSelectedRows] = useState(new Set())

	// Toggle row selection
	const toggleRowSelection = (inputID, rankingByInputId) => {
		const key = `${inputID}-${rankingByInputId}`

		setSelectedRows(prev => {
			const updated = new Set(prev)
			if (updated.has(key)) {
				updated.delete(key)
			} else {
				updated.add(key)
			}
			return updated
		})
	}

	// Render table rows with selection checkboxes
	// Render table rows with selection checkboxes
	const updateTable = () => {
		const paginatedResults = outputRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
		let style1 = { background: "#fff", borderRight: "1px solid #fff" }
		let style2 = { background: "#f1f2f3", borderRight: "1px solid #f1f2f3" }

		return paginatedResults.map((result, index) => {
			const key = `${result.inputID}-${result.rankingByInputId}`
			const isSelected = selectedRows.has(key)

			return (
				<tr key={key} style={{ background: "grey", border: "1px solid grey" }}>
					<td style={index % 2 === 0 ? style1 : style2}>
						<input type="checkbox" checked={isSelected} onChange={() => toggleRowSelection(result.inputID, result.rankingByInputId)} />
					</td>
					<td style={index % 2 === 0 ? style1 : style2}>#{result.inputID}</td>
					<td style={index % 2 === 0 ? style1 : style2}>#{result.rankingByInputId}</td>
					<td style={index % 2 === 0 ? style1 : style2} id="address">
						{result.name}, {result.county}, {result.region_a}
					</td>
					<td style={index % 2 === 0 ? style1 : style2}>{result.lat || "N/A"}</td>
					<td style={index % 2 === 0 ? style1 : style2}>{result.lon || "N/A"}</td>
					<td style={index % 2 === 0 ? style1 : style2}>{`${result.matchConfidencePercentageDecimal * 100} % ` || "N/A"}</td>
					<td style={index % 2 === 0 ? style1 : style2}>{result.accuracy || "N/A"}</td>
				</tr>
			)
		})
	}

	const exportSelectedRows = () => {
		// Map of inputID and rankingByInputId combinations
		const selectedData = outputRows.filter(row => {
			const key = `${row.inputID}-${row.rankingByInputId}`
			return selectedRows.has(key)
		})

		if (selectedData.length === 0) {
			alert("No rows selected for export.")
			return
		}

		const csvData = convertArrayToCSV(selectedData)
		const geoJsonData = convertArrayToGeoJSON(selectedData)
		const md5Checksum = CryptoJS.MD5(csvData).toString()
		createAndDownloadZip(csvData, JSON.stringify(metadata, null, 2), geoJsonData, Date.now(), md5Checksum)
	}

	// Function to find inputIDs with only one return
	const findSingleReturnInputIDs = () => {
		// Create a map to count occurrences of each inputID
		const inputIDCount = new Map()

		// Iterate over outputRows to count each inputID
		outputRows.forEach(row => {
			const count = inputIDCount.get(row.inputID) || 0
			inputIDCount.set(row.inputID, count + 1)
		})

		// Filter out the inputIDs with only one return
		const singleReturnInputIDs = []
		inputIDCount.forEach((count, inputID) => {
			if (count === 1) {
				singleReturnInputIDs.push(inputID)
			}
		})

		// Return the list of inputIDs with only one return
		return singleReturnInputIDs
	}

	const getPageNumbers = (currentPage, totalPages) => {
		const PAGE_RANGE = 5
		const startPage = Math.max(1, currentPage - Math.floor(PAGE_RANGE / 2))
		const endPage = Math.min(totalPages, currentPage + Math.floor(PAGE_RANGE / 2))

		let pages = []

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		return pages
	}

	// In your component
	const pageNumbers = getPageNumbers(currentPage, totalPages)

	const clearSelectedRows = () => {
		// Assuming `setSelectedRows` is a state updater function from `useState`
		setSelectedRows(new Set()) // Clear the selected rows by setting an empty set
	}

	return (
		<div className="reverse-bulk-container">
			<div>
				<form>
					<fieldset>
						<legend>File Upload and Settings</legend>

						<div>
							<label htmlFor="file-upload">Upload a CSV file:</label>
							<input
								id="file-upload"
								type="file"
								accept=".csv"
								onChange={handleFileUpload}
								aria-required="true" // Indicates that file upload is required if applicable
							/>
						</div>

						<div>
							<fieldset>
								<legend>Select Number of Return Candidates per input:</legend>
								<label htmlFor="candidate-slider">Number of candidates:</label>
								<input
									id="candidate-slider"
									type="range"
									min="2"
									max="10"
									step="1"
									value={userCandidatesSelection}
									onChange={handleSliderChange}
									aria-labelledby="candidate-slider-label"
									aria-describedby="candidate-slider-description"
									style={{ width: "100px" }}
								/>
								<span id="candidate-slider-description">Value: {userCandidatesSelection}</span>
							</fieldset>
						</div>
					</fieldset>
				</form>
				<GcdsButton size="small" disabled={!file} ref={processButtonRef}>
					REVERSE GEOCODE
				</GcdsButton>
			</div>
			{progress < 100 && (
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
			)}
			{loading && progress === 0 && (
				<div className="loading" aria-live="polite">
					<Loading />
				</div>
			)}

			{progress > 0 && progress < 100 && <progress value={progress / 100} max="1" aria-label="Loading progress"></progress>}

			{mapReady && !loading && progress <= 100 && (
				<>
					<div style={{ height: "600px", width: "100%", paddingTop: "40px" }}>
						<MapContainer center={initialLatLng} zoom={3} style={{ height: "100%" }}>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							/>
							{originalRows.map((row, index) => {
								const [item1, item2, item3] = row.split(",").map(value => parseFloat(value))

								return (
									<CircleMarker
										key={index}
										center={[item2, item3]}
										color="blue"
										radius={5}
										pathOptions={{
											fillColor: "blue",
											color: "black",
											weight: 1,
											opacity: 1,
											fillOpacity: 0.8,
										}}
									>
										<Popup>
											<div style={{ lineHeight: 0.1 }}>
												<p>Row ID: {item1}</p>
												<p>Latitude: {item2}</p>
												<p>Longitude: {item3}</p>
											</div>
										</Popup>
									</CircleMarker>
								)
							})}
							{outputRows.map((row, index) => (
								<CircleMarker
									key={index}
									center={[row.ddLatOut, row.ddLongOut]}
									color={calculateMarkerColor(row.matchConfidencePercentageDecimal)}
									radius={5}
									pathOptions={{
										fillColor: calculateMarkerColor(row.matchConfidencePercentageDecimal),
										color: "black",
										weight: 1,
										opacity: 1,
										fillOpacity: 0.8,
									}}
								>
									<Popup>
										<div style={{ lineHeight: 0.1, width: "auto" }}>
											<p>
												<strong>
													{row.name && (
														<>
															{row.name}, {row.locality}, {row.region}
														</>
													)}
												</strong>
											</p>
											<p>
												Row ID & Ranking: {row.inputID} - #{row.rankingByInputId}
											</p>
											<p>Confidence: {row.matchConfidencePercentageDecimal * 100}%</p>
											<p>Distance from original: {row.distanceKm} km</p>
											{row.name && <p>Street name: {row.name}</p>}
											{row.locality && <p>Locality: {row.locality}</p>}
											{row.region && <p>Province: {row.region}</p>}
											{row.accuracy && <p>Accuracy: {row.accuracy}</p>}
										</div>
									</Popup>
								</CircleMarker>
							))}
						</MapContainer>
					</div>

					<div>
						<h3>Results</h3>
						<div>
							<GcdsButton size="small" onClick={createAndDownloadZip}>
								Download all results
							</GcdsButton>
						</div>
						<div>
							<p>
								Total Rows Submitted / Returned: {originalRows.length} / {outputRows.length}
							</p>
							<fieldset>
								<h4>The following inputs returned only 1 result:</h4>
								<p>This means the latitude and/or longitude are not accurate enough to create a match. Please check these and try again.</p>
								<ul>
									{findSingleReturnInputIDs().map(inputID => (
										<li key={inputID}>Input ID #{inputID}</li>
									))}
								</ul>
							</fieldset>
							<table border="1">
								<thead>
									<tr>
										<th scope="col">Range</th>
										<th scope="col">Count</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>100%</td>
										<td>{count_100 || 0}</td>
									</tr>
									<tr>
										<td>80% - 99%</td>
										<td>{count_80_to_99 || 0}</td>
									</tr>
									<tr>
										<td>50% - 80%</td>
										<td>{count_50_to_80 || 0}</td>
									</tr>
									<tr>
										<td>30% - 50%</td>
										<td>{count_30_to_50 || 0}</td>
									</tr>
									<tr>
										<td>0% - 30%</td>
										<td>{count_0_to_30 || 0}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<GcdsGrid columns="repeat(auto-fit, minmax(100px, 225px))" container="full">
							<div>
								<label htmlFor="page-select" className="label-style">
									Jump to page:
								</label>
								<select id="page-select" value={currentPage} onChange={handlePageChange} className="select-style">
									{[...Array(totalPages).keys()].map(page => (
										<option key={page + 1} value={page + 1}>
											Page {page + 1}
										</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor="rows-select" className="label-style">
									Rows per page:
								</label>
								<select id="rows-select" value={rowsPerPage} onChange={handleRowsPerPageChange} className="select-style">
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
							</div>
						</GcdsGrid>

						<table ref={resultsTableRef}>
							<thead>
								<tr>
									<th scope="col">Select</th>
									<th scope="col">Input ID</th>
									<th scope="col">Input ID Ranking</th>
									<th scope="col">Physical Address</th>
									<th scope="col">Latitude</th>
									<th scope="col">Longitude</th>
									<th scope="col">Confidence Level</th>
									<th scope="col">Accuracy</th>
								</tr>
							</thead>
							<tbody>{updateTable()}</tbody>
						</table>
						<div>
							<br />
							<GcdsButton size="small" onClick={exportSelectedRows} disabled={selectedRows.size === 0}>
								Export Selected
							</GcdsButton>
							<GcdsButton style={{ padding: "2px" }} onClick={clearSelectedRows} size="small" disabled={selectedRows.size === 0}>
								Clear Selected
							</GcdsButton>
						</div>

						<div style={{ width: "full", display: "flex", justifyContent: "center" }}>
							<div id="paginationContainer">
								<GcdsButton size="small" onClick={() => setCurrentPage(1)} aria-label="First Page" disabled={currentPage === 1} style={{ padding: "2px" }}>
									First
								</GcdsButton>
								<GcdsButton
									size="small"
									onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
									aria-label="Previous Page"
									disabled={currentPage === 1}
									style={{ padding: "2px" }}
								>
									<FaAngleLeft />
								</GcdsButton>
								{pageNumbers
									.filter(page => !isNaN(page))
									.map(page => (
										<GcdsButton
											style={{ padding: "2px" }}
											size="small"
											key={page}
											value={page}
											buttonRole={currentPage === page ? "primary" : "secondary"}
											onClick={() => handlePageChange({ target: { value: page } })}
										>
											{page}
										</GcdsButton>
									))}
								<GcdsButton
									style={{ padding: "2px" }}
									size="small"
									onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
									aria-label="Next Page"
									disabled={currentPage === totalPages}
								>
									<FaAngleRight />
								</GcdsButton>
								<GcdsButton style={{ padding: "2px" }} size="small" onClick={() => setCurrentPage(totalPages)} aria-label="Last Page" disabled={currentPage === totalPages}>
									Last
								</GcdsButton>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default ReverseBulk
