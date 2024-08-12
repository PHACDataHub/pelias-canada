/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { saveAs } from "file-saver"
import "./ForwardBulk.css"
import { GcdsButton, GcdsContainer, GcdsGrid } from "@cdssnc/gcds-components-react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import Loading from "../Loading"
import CryptoJS from "crypto-js"
import JSZip from "jszip"
import { useTranslation } from "react-i18next"

export default function ForwardBulk() {
	const { t } = useTranslation()
	const [results, setResults] = useState([])
	const [progress, setProgress] = useState(0)
	const [mapReady, setMapReady] = useState(false)
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [status, setStatus] = useState("")
	const [epochExecution, setEpochExecution] = useState(Date.now())
	const [totalRowsSubmitted, setTotalRowsSubmitted] = useState(0)
	const [totalRowsGeocoded, setTotalRowsGeocoded] = useState(0)
	const [totalPages, setTotalPages] = useState(0) // New state for total pages
	const mapRef = useRef(null)
	const resultsTableRef = useRef(null)
	const markers = useRef([])
	const fileInputRef = useRef(null)
	const [metadata, setMetadata] = useState({})
	const boundsRef = useRef(L.latLngBounds())
	const [confidenceBreakdown, setConfidenceBreakdown] = useState({})
	const [isFileUploaded, setIsFileUploaded] = useState(false)

	const count_100 = results.filter(result => result.confidenceLevel === 100).length
	const count_80_to_99 = results.filter(result => result.confidenceLevel >= 80 && result.confidenceLevel < 100).length
	const count_50_to_80 = results.filter(result => result.confidenceLevel >= 50 && result.confidenceLevel < 80).length
	const count_30_to_50 = results.filter(result => result.confidenceLevel >= 30 && result.confidenceLevel < 50).length
	const count_0_to_30 = results.filter(result => result.confidenceLevel >= 0 && result.confidenceLevel < 30).length

	const addLegend = () => {
		const legend = L.control({ position: "bottomright" })

		const getColor = d => {
			return d >= 100 ? "green" : d > 80 ? "lightgreen" : d > 50 ? "yellow" : d > 30 ? "orange" : "red"
		}

		legend.onAdd = () => {
			const div = L.DomUtil.create("div", "info legend")

			// Set background color and opacity
			div.style.backgroundColor = "rgba(255, 255, 255, 0.5)" // white background with 50% opacity
			div.style.padding = "8px" // Add some padding
			div.style.borderRadius = "4px" // Optional: make the corners rounded
			div.style.fontSize = "14px" // Optional: make the corners rounded

			// Add the legend title
			div.innerHTML = `<strong>Confidence / Confiance</strong><br>`

			// Adjust the grades to avoid overlapping ranges
			const grades = [0, 30, 50, 80, 99]
			let labels = []
			let from, to

			for (let i = 0; i < grades.length - 1; i++) {
				from = grades[i]
				to = grades[i + 1]

				labels.push(
					'<i style="background:' +
						getColor(from + 1) +
						'; width: 14px; height: 14px; display: inline-block; margin-right: 8px;"></i> ' +
						from +
						`%` +
						(to ? "&ndash;" + to + `%` : "+")
				)
			}

			// Add the final label for 100%
			labels.push('<i style="background:' + getColor(100) + '; width: 14px; height: 14px; display: inline-block; margin-right: 8px;"></i> 100%')

			// Add the labels to the legend
			div.innerHTML += labels.join("<br>")
			return div
		}

		legend.addTo(mapRef.current)
	}

	useEffect(() => {
		if (mapReady) {
			mapRef.current = L.map("map").setView([56.1304, -106.3468], 4) // Center map on Canada
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current)
			addLegend() // Add the legend to the map
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.remove()
			}
		}
	}, [mapReady])

	useEffect(() => {
		// Update total pages whenever results or rowsPerPage change
		setTotalPages(Math.ceil(results.length / rowsPerPage))
	}, [results, rowsPerPage])

	const handleFileChange = e => {
		if (e.target.files.length > 0) {
			setIsFileUploaded(true)
			// console.log("File selected:", e.target.files[0].name) // Log file name when a file is selected
		} else {
			setIsFileUploaded(false)
		}
	}
	const handleFileUpload = () => {
		const file = fileInputRef.current.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				let csvData = e.target.result
				csvData = csvData.replace(/("\s*\n\s*")/g, " ") // Replace newline within quotes with a space
				resetMapAndTable()
				setEpochExecution(Date.now()) // Update epochExecution at the start of each new run
				setTotalRowsSubmitted(csvData.split("\n").length - 1) // Exclude header row
				setTotalRowsGeocoded(0) // Reset geocoded count
				setStatus("Processing...")
				processCSV(csvData)
			}
			setLoading(false)
			reader.readAsText(file)
		} else {
			alert("Please select a file to upload.")
		}
	}

	const processCSV = data => {
		const lines = data.split("\n").filter(line => line.trim() !== "")
		const headers = lines[0].split(",").map(header => header.trim().toLowerCase())
		if (!headers.includes("inputid") || !headers.includes("physicaladdress")) {
			alert("CSV must contain inputID and physicalAddress columns")
			return
		}

		const processedResults = lines
			.slice(1)
			.map(line => {
				const cols = line.split(",")
				const inputID = cols[headers.indexOf("inputid")]
				const addressParts = cols.slice(headers.indexOf("physicaladdress")).join(",").replace(/^"|"$/g, "").trim()
				return {
					inputID,
					physicalAddress: removeUnitPrefix(addressParts),
				}
			})
			.filter(result => result.inputID && result.physicalAddress)

		setResults(processedResults)
		geocodeAddresses(processedResults)
		setProgress(100)
		setMapReady(true)
	}

	const resetMapAndTable = () => {
		clearMap()
		if (mapRef.current) {
			mapRef.current.setView([56.1304, -106.3468], 4) // Reset map view
		}
		setResults([])
		setCurrentPage(1)
		setStatus("")
		setMapReady(false)
		boundsRef.current = L.latLngBounds() // Reset bounds
	}

	const clearMap = () => {
		markers.current.forEach(marker => marker.remove())
		markers.current = []
	}

	const geocodeAddresses = async results => {
		const startTime = Date.now()
		for (const result of results) {
			const addressAfterUnitRemoval = removeUnitPrefix(result.physicalAddress)

			try {
				const response = await fetch(`https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(addressAfterUnitRemoval)}`)
				const data = await response.json()
				if (data.features.length === 0) {
					console.error("No geocoding results for address:", addressAfterUnitRemoval)
					setStatus(`No results for address: ${addressAfterUnitRemoval}`)
					continue
				}
				processGeocodeResult(result, data)
				setTotalRowsGeocoded(prev => prev + 1)
			} catch (error) {
				console.error("Geocoding error for address:", addressAfterUnitRemoval, error)
				setStatus(`Error geocoding address: ${addressAfterUnitRemoval}`)
			}
		}
		setLoading(false)
		const endTime = Date.now()
		const elapsedTime = ((endTime - startTime) / 1000).toFixed(2)
		setStatus(`Processing complete. Time taken: ${elapsedTime} seconds.`)
		// Zoom and center map to fit all markers
		if (markers.current.length > 0) {
			// Fit the bounds to include all markers
			mapRef.current.fitBounds(boundsRef.current)

			// Use setTimeout to ensure fitBounds is applied before zooming out
			setTimeout(() => {
				// Get the current zoom level
				const currentZoom = mapRef.current.getZoom()
				// Decrease the zoom level by 1 to zoom out
				const newZoom = currentZoom - 1
				// Apply the new zoom level
				mapRef.current.setZoom(newZoom)
			}, 0) // Delay to ensure fitBounds completes first
		}
	}

	const removeUnitPrefix = address => {
		const unitRegex1 =
			/^(?:Unit|Apt|Apartment|Flat|Suite|#|No\.|Rm|Floor|Deck|Building|Tower|Block|Level|Space|Office|Loft|Appartement|Unité|Étage|Chambre|Bureau|Logement|Numéro|Bloc|Tour)\s*\d*\s*(.+)$/i
		const unitRegex2 = /^\d+-\d+\s+(.+)$/i
		let modifiedAddress = address.trim()

		let match1 = modifiedAddress.match(unitRegex1)
		if (match1) {
			modifiedAddress = match1[1].trim()
		} else {
			let match2 = modifiedAddress.match(unitRegex2)
			if (match2) {
				modifiedAddress = match2[1].trim()
			}
		}

		return modifiedAddress.replace(/"$/, "") // Remove trailing quotes
	}

	const processGeocodeResult = (result, data) => {
		const feature = data.features[0]
		if (!feature) return

		const lat = feature.geometry.coordinates[1]
		const lng = feature.geometry.coordinates[0]
		const confidence = feature.properties.confidence * 100
		const matchType = feature.properties.match_type
		const accuracy = feature.properties.accuracy

		result.latitude = lat
		result.longitude = lng
		result.confidenceLevel = confidence
		result.matchType = matchType
		result.accuracy = accuracy // Include accuracy in the result

		const marker = L.circleMarker([lat, lng], {
			radius: 8,
			fillColor: getColor(confidence),
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8,
		}).addTo(mapRef.current)

		marker.bindPopup(`
            <b>ID:</b> ${result.inputID}<br>
            <b>Address/Adresse:</b><br> ${result.physicalAddress}<br>
            <b>Latitude/Latitude:</b> ${lat}<br>
            <b>Longitude/Longitude:</b> ${lng}<br>
            <b>Confidence/Confiance:</b> ${confidence}%<br>
            <b>Match Type/Type de match:</b> ${matchType}<br>
            <b>Accuracy/Précision :</b> ${accuracy}
        `)
		markers.current.push(marker)

		// Extend bounds to include this marker
		boundsRef.current.extend([lat, lng])
	}

	const getColor = confidence => {
		return confidence <= 20 ? "red" : confidence <= 40 ? "orange" : confidence <= 60 ? "yellow" : confidence <= 80 ? "lightgreen" : "green"
	}

	const updateTable = () => {
		const paginatedResults = results.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
		let style1 = { background: "#fff", borderRight: "1px solid #fff" }
		let style2 = { background: "#f1f2f3", borderRight: "1px solid #f1f2f3" }
		return paginatedResults.map((result, index) => (
			<tr key={index} style={{ background: "grey", border: "1px solid grey" }}>
				<td style={index % 2 === 0 ? style1 : style2}>{result.inputID}</td>
				<td style={index % 2 === 0 ? style1 : style2} id="address">
					{result.physicalAddress}
				</td>
				<td style={index % 2 === 0 ? style1 : style2}>{result.latitude || "N/A"}</td>
				<td style={index % 2 === 0 ? style1 : style2}>{result.longitude || "N/A"}</td>
				<td style={index % 2 === 0 ? style1 : style2}>{`${result.confidenceLevel} % ` || "N/A"}</td>
				<td style={index % 2 === 0 ? style1 : style2}>{result.matchType || "N/A"}</td>
				<td style={index % 2 === 0 ? style1 : style2}>{result.accuracy || "N/A"}</td>
			</tr>
		))
	}

	// Compute MD5 checksum
	const computeMD5Checksum = content => {
		return CryptoJS.MD5(content).toString(CryptoJS.enc.Hex)
	}

	const handleDownload = async type => {
		let filename
		let content
		let checksumFilename
		let checksumContent

		if (type === "csv") {
			filename = `output_${epochExecution}.csv`
			content = [
				'"inputID","physicalAddress","latitude","longitude","confidenceLevel","matchType","accuracy"',
				...results.map(result =>
					[
						`"${result.inputID || ""}"`,
						`"${result.physicalAddress.replace(/"/g, '""').replace(/"$/, "") || ""}"`,
						`"${result.latitude || ""}"`,
						`"${result.longitude || ""}"`,
						`"${result.confidenceLevel || ""}"`,
						`"${result.matchType || ""}"`,
						`"${result.accuracy || ""}"`, // Include accuracy in the CSV
					].join(",")
				),
			].join("\n")
			checksumFilename = `output_${epochExecution}_checksum.txt`
		} else if (type === "geojson") {
			filename = `output_${epochExecution}.geojson`
			content = JSON.stringify({
				type: "FeatureCollection",
				features: results
					.filter(result => result.latitude && result.longitude)
					.map(result => ({
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates: [result.longitude, result.latitude],
						},
						properties: {
							inputID: result.inputID,
							physicalAddress: result.physicalAddress,
							confidenceLevel: result.confidenceLevel,
							matchType: result.matchType,
							accuracy: result.accuracy, // Include accuracy in the GeoJSON
						},
					})),
			})
			checksumFilename = `output_${epochExecution}_checksum.txt`
		}

		const checksum = computeMD5Checksum(content) // Compute checksum

		const epochInitiated = Date.now()
		const newMetadata = {
			epochInitiated: epochInitiated,
			coordinateSystem: "WGS 1984",
			accurateMatchScores: {
				"0-0.3": count_0_to_30 || 0,
				"0.3-0.5": count_30_to_50 || 0,
				"0.5-0.8": count_50_to_80 || 0,
				"0.8-0.99": count_80_to_99 || 0,
				"1.0": count_100 || 0,
			},
			totalRowsProcessed: results.length, // Set total rows processed
		}
		setMetadata(newMetadata)

		// Create a new JSZip instance
		const zip = new JSZip()
		// Add files to the zip
		zip.file(filename, content)
		zip.file(checksumFilename, `MD5 Checksum: ${checksum}`)
		zip.file("metadata.json", JSON.stringify(newMetadata, null, 2)) // Add metadata as a JSON file

		// Generate the zip file and trigger download
		zip.generateAsync({ type: "blob" }).then(blob => {
			saveAs(blob, `output_${epochExecution}.zip`)
		})
	}

	const handleRowsPerPageChange = event => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setCurrentPage(1) // Reset to first page when rows per page changes
	}

	const handlePageChange = event => {
		setCurrentPage(parseInt(event.target.value, 10))
	}

	const getConfidenceBreakdown = results => {
		const breakdown = {
			lessThan30: 0,
			between30And50: 0,
			between50And80: 0,
			between80And99: 0,
			hundredPercent: 0,
		}

		results.forEach(result => {
			const confidence = result.confidenceLevel
			if (confidence < 30) {
				breakdown.lessThan30 += 1
			} else if (confidence < 50) {
				breakdown.between30And50 += 1
			} else if (confidence < 80) {
				breakdown.between50And80 += 1
			} else if (confidence < 100) {
				breakdown.between80And99 += 1
			} else if (confidence === 100) {
				breakdown.hundredPercent += 1
			}
		})

		return breakdown
	}
	useEffect(() => {
		const breakdown = getConfidenceBreakdown(results)
		setConfidenceBreakdown(breakdown)
	}, [results])

	return (
		<div>
			<fieldset>
				<legend>File Upload </legend>
				<input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange}/>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "150px", paddingTop: "20px" }}>
					<GcdsButton
						size="small"
						onClick={() => {
							handleFileUpload()
							setLoading(true)
						}}
						disabled={!isFileUploaded}
					>
						Submit
					</GcdsButton>
					<GcdsButton
						size="small"
						onClick={() => {
							resetMapAndTable()
							fileInputRef.current.value = ""
							setLoading(false)
							setIsFileUploaded(false)
						}}
						disabled={!isFileUploaded}
					>
						Reset
					</GcdsButton>
				</div>
			</fieldset>

			{progress > 0 && progress < 100 && <p>Progress: {progress}%</p>}

			{loading === true ? (
				<div>
					<Loading />
					Loading, please wait
				</div>
			) : null}
			{mapReady && progress === 100 && (
				<>
					<br />
					<div id="map" style={{ height: "400px" }}></div>
					<GcdsContainer size="xl" centered padding="400" margin="400">
						<h3> Results </h3>
						<div>
							<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "350px", paddingTop: "20px" }}>
								<GcdsButton size="small" onClick={() => handleDownload("csv")} disabled={totalRowsSubmitted - 1 !== totalRowsGeocoded}>
									Download CSV
								</GcdsButton>
								<GcdsButton size="small" onClick={() => handleDownload("geojson")} disabled={totalRowsSubmitted - 1 !== totalRowsGeocoded}>
									Download GeoJSON
								</GcdsButton>
							</div>
							<p>
								Total Rows Submitted / Returned: {totalRowsSubmitted - 1} / {totalRowsGeocoded}
							</p>
						</div>
						<div>
							<table border="1">
								<thead>
									<tr>
										<th>Range</th>
										<th>Count</th>
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
									<th>Input ID</th>
									<th>Physical Address</th>
									<th>Latitude</th>
									<th>Longitude</th>
									<th>Confidence Level</th>
									<th>Match Type</th>
									<th>Accuracy</th>
								</tr>
							</thead>
							<tbody>{updateTable()}</tbody>
						</table>
						<div style={{ width: "full" }}>
							<div id="pageationContainer">
								<GcdsButton size="small" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} aria-label="Previous Page" disabled={currentPage === 1}>
									<FaAngleLeft />
								</GcdsButton>
								{[...Array(totalPages).keys()].map((page, index) => (
									<GcdsButton size="small" key={index} value={page + 1} buttonRole={currentPage === page + 1 ? "primary" : "secondary"} onClick={handlePageChange}>
										{page + 1}
									</GcdsButton>
								))}
								<GcdsButton size="small" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} aria-label="Next Page" disabled={currentPage === totalPages}>
									<FaAngleRight />
								</GcdsButton>
							</div>
						</div>
					</GcdsContainer>
				</>
			)}
		</div>
	)
}
