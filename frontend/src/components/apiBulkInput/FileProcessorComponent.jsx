import { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import ExcelJS from "exceljs"
import { GcdsButton, GcdsDetails } from "@cdssnc/gcds-components-react"
import MapComponentOL from "../MapComponent"

const FileProcessorComponent = ({ jsonData }) => {
	const [processedData, setProcessedData] = useState([])
	const [physicalAddressArray, setPhysicalAddressArray] = useState([])
	const [apiResponses, setApiResponses] = useState({})
	const [isProcessing, setIsProcessing] = useState(false)
	const [progress, setProgress] = useState(0)
	const [results, setResults] = useState([])
	const [returnedCount, setReturnedCount] = useState(0)
	const [exportTitle, setExportTitle] = useState("")


	const inputCount = jsonData.length

	const replaceSpecialCharacters = str => {
		if (typeof str !== "string") return ""
		return str.replace(/[^\w\s-]/gi, "")
	}

	const extractUnitNumber = address => {
		const match = address.match(/^([^\d]*\d+\s?-\s?)?(.*)$/)
		if (match) {
			return { unitNumber: match[1] || "", address: match[2] }
		}
		return { unitNumber: "", address }
	}
	const processJsonData = useCallback(() => {
		if (!jsonData || jsonData.length === 0) return []

		const allHeaders = new Set()
		const processedLines = jsonData.map(row => {
			const processedRow = {}

			// Create a new object to map the keys to the standardized keys
			const newRow = {}
			Object.keys(row).forEach(key => {
				const standardizedKey = key.match(/physical\s*address/i) ? "Physical Address" : key
				newRow[standardizedKey] = row[key]
			})

			Object.keys(newRow).forEach(key => {
				if (key === "Physical Address") {
					const { unitNumber, address } = extractUnitNumber(replaceSpecialCharacters(newRow[key].replace(/\n/g, " ")))
					processedRow["Unit Number"] = unitNumber.trim()
					processedRow[key] = address.trim()
				} else {
					processedRow[key] = newRow[key] || ""
				}
				allHeaders.add(key)
			})

			return processedRow
		})

		const physicalAddresses = processedLines.map(row => row["Physical Address"])
		setProcessedData(processedLines)
		setPhysicalAddressArray(physicalAddresses)

		return processedLines
	}, [jsonData])

	useEffect(() => {
		if (jsonData && jsonData.length > 0) {
			const processedDataToSend = processJsonData()
			if (processedDataToSend.length > 0) {
				sendAddressesToApi()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jsonData, processJsonData])

	const sendAddressesToApi = useCallback(async () => {
		setIsProcessing(true)
		const totalAddresses = physicalAddressArray.length
		let completedAddresses = 0
		const results = []

		const MAX_RETRY = 3

		const fetchWithRetry = async (url, retries = MAX_RETRY, delay = 200) => {
			try {
				const response = await fetch(url)
				if (url === `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=`) {
					throw new Error(`"empty row`)
				}
				if (!response.ok) {
					if (retries > 0 && response.status >= 500 && response.status < 600) {
						console.warn(`Retrying ${url}, ${retries} retries left`)
						await new Promise(resolve => setTimeout(resolve, delay))
						return fetchWithRetry(url, retries - 1, delay)
					} else {
						throw new Error(`HTTP error! status: ${response.status}`)
					}
				}
				return response.json()
			} catch (error) {
				console.error("Error:", error)
				return null
			}
		}

		const processAddress = async address => {
			try {
				const apiUrl = `https://geocoder.alpha.phac.gc.ca/api/v1/search?text=${encodeURIComponent(address)}`
				const responseData = await fetchWithRetry(apiUrl)

				if (responseData && responseData !== "") {
					console.log(`Address uploading`)

					setApiResponses(prevResponses => ({
						...prevResponses,
						[address]: responseData,
					}))
					results.push({ address, data: responseData })
				} else {
					console.error(`Failed to make API call for address ${address} after ${MAX_RETRY} attempts`)
					results.push({ address, error: `Failed to fetch after ${MAX_RETRY} retries` })
				}
			} catch (error) {
				console.error(`Error making API call for address ${address}:`, error)
				results.push({ address, error: error.message })
			} finally {
				completedAddresses++
				const currentProgress = (completedAddresses / totalAddresses) * 100
				setProgress(currentProgress)
			}
		}

		for (const address of physicalAddressArray) {
			await processAddress(address)
		}

		if (results.length > 0) {
			console.log("Final results:", results)
		}
		setIsProcessing(false)
		setReturnedCount(results.length)
		setResults(results)
	}, [physicalAddressArray])

	useEffect(() => {
		if (processedData.length > 0) {
			sendAddressesToApi()
		}
	}, [processedData, sendAddressesToApi])

	const count_85_to_100 = results.filter(result => result.data?.features?.[0]?.properties?.confidence >= 0.85).length
	const count_84_to_51 = results.filter(result => result.data?.features?.[0]?.properties?.confidence >= 0.51 && result.data?.features?.[0]?.properties?.confidence < 0.85).length
	const count_0_to_50 = results.filter(result => result.data?.features?.[0]?.properties?.confidence >= 0 && result.data?.features?.[0]?.properties?.confidence < 0.51).length

	const display_0_to_50 = useCallback(() => {
		const filteredResults = results.filter(result => {
			const confidence = result.data?.features?.[0]?.properties?.confidence
			return confidence !== undefined && confidence >= 0 && confidence < 0.51
		})

		if (filteredResults.length !== 0)
			return (
				<div>
					<h2>Addresses below 50% confidence</h2>
					<ul>
						{filteredResults.map((result, index) => (
							<li key={index}>
								<strong>Address:</strong> {result.address} <br />
							</li>
						))}
					</ul>
				</div>
			)
		return null
	}, [results])

	const exportToExcel = useCallback(async () => {
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet("Geocoding Results")

		worksheet.addRow(["Address", "Confidence", "Match Type", "Accuracy", "Source", "Longitude", "Latitude", "Timestamp"])

		for (const result of results) {
			if (!result.data || !result.data.features || !result.data.features[0] || !result.data.features[0].properties) {
				const unitNumber = processedData.find(row => row["Physical Address"] === result.address)?.["Unit Number"] || ""
				worksheet.addRow([unitNumber ? `${unitNumber} ${result.address}` : result.address, "", "", "", "", "", "", ""])
				continue
			}

			const inputAddress = result.address
			const feature = result.data.features[0]

			const confidence = feature.properties.confidence ? feature.properties.confidence.toFixed(2) : ""
			const matchType = feature.properties.match_type || ""
			const accuracy = feature.properties.accuracy || ""
			const source = feature.properties.source || ""
			const timestamp = convertTimestamp(result.data.geocoding.timestamp) || ""
			const longitude = feature.geometry.coordinates ? feature.geometry.coordinates[0] : ""
			const latitude = feature.geometry.coordinates ? feature.geometry.coordinates[1] : ""
			const unitNumber = processedData.find(row => row["Physical Address"] === inputAddress)?.["Unit Number"] || ""

			worksheet.addRow([unitNumber ? `${unitNumber} ${inputAddress}` : inputAddress, `${confidence * 100}%`, matchType, accuracy, source, longitude, latitude, timestamp])
		}

		const buffer = await workbook.xlsx.writeBuffer()
		const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
		const link = document.createElement("a")
		link.href = window.URL.createObjectURL(blob)
		link.download = `${exportTitle || "export"}_geocoding_results.xlsx`
		link.click()
	}, [results, exportTitle, processedData])

	const exportToCSV = useCallback(() => {
		const headers = ["Address", "Confidence", "Match Type", "Accuracy", "Source", "Longitude", "Latitude", "Timestamp"]
		const csvContent = [
			headers.join(","),
			...results.map(result => {
				if (!result.data || !result.data.features || !result.data.features[0] || !result.data.features[0].properties) {
					const unitNumber = processedData.find(row => row["Physical Address"] === result.address)?.["Unit Number"] || ""
					return `${unitNumber ? `${unitNumber} ${result.address}` : result.address},,,,,,,`
				}

				const inputAddress = result.address
				const feature = result.data.features[0]
				const properties = feature.properties
				const confidence = properties.confidence ? (properties.confidence * 100).toFixed(2) + " %" : ""
				const matchType = properties.match_type || ""
				const accuracy = properties.accuracy || ""
				const source = properties.source || ""
				const timestamp = convertTimestamp(result.data.geocoding.timestamp) || "" // Use optional chaining to handle undefined geocoding
				const longitude = feature.geometry.coordinates ? feature.geometry.coordinates[0] : ""
				const latitude = feature.geometry.coordinates ? feature.geometry.coordinates[1] : ""
				const unitNumber = processedData.find(row => row["Physical Address"] === inputAddress)?.["Unit Number"] || ""

				return `${unitNumber ? `${unitNumber} ${inputAddress}` : inputAddress},${confidence},${matchType},${accuracy},${source},${longitude},${latitude},${timestamp}`
			}),
		].join("\n")

		downloadCSV(csvContent)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [results, processedData])

	const downloadCSV = useCallback(
		csvContent => {
			const blob = new Blob([csvContent], { type: "text/csv" })
			const link = document.createElement("a")
			link.href = window.URL.createObjectURL(blob)
			link.download = `${exportTitle || "export"}_geocoding_results.csv`
			link.click()
		},
		[exportTitle]
	)
	const exportToGeoJSON = useCallback(() => {
		const geojson = {
			type: "FeatureCollection",
			features: results.map(result => {
				if (!result.data || !result.data.features || !result.data.features[0] || !result.data.features[0].properties) {
					return null
				}
	
				const inputAddress = result.address
				const feature = result.data.features[0]
				const properties = feature.properties
				const confidence = properties.confidence ? (properties.confidence * 100).toFixed(2) + " %" : ""
				const matchType = properties.match_type || ""
				const accuracy = properties.accuracy || ""
				const source = properties.source || ""
				const timestamp = convertTimestamp(result.data.geocoding.timestamp) || "" // Use optional chaining to handle undefined geocoding
				const unitNumber = processedData.find(row => row["Physical Address"] === inputAddress)?.["Unit Number"] || ""
	
				return {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: feature.geometry.coordinates
					},
					properties: {
						Address: unitNumber ? `${unitNumber} ${inputAddress}` : inputAddress,
						Confidence: confidence,
						"Match Type": matchType,
						Accuracy: accuracy,
						Source: source,
						Timestamp: timestamp,
						UnitNumber: unitNumber
					}
				}
			}).filter(feature => feature !== null)
		}
	
		downloadGeoJSON(geojson)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [results, processedData])
	
	const downloadGeoJSON = useCallback(
		geojson => {
			const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" })
			const link = document.createElement("a")
			link.href = window.URL.createObjectURL(blob)
			link.download = `${exportTitle || "export"}_geocoding_results.geojson`
			link.click()
		},
		[exportTitle]
	)
	

	const mapContentJSON = Object.keys(apiResponses).map(address => {
		const result = apiResponses[address]
		const feature = result?.features?.[0] ?? {}
		const properties = feature?.properties ?? {}
		const geometry = feature?.geometry ?? {}
		const longitude = geometry.coordinates ? geometry.coordinates[0] : "N/A"
		const latitude = geometry.coordinates ? geometry.coordinates[1] : "N/A"
		const confidence = properties.confidence !== undefined ? (properties.confidence * 100).toFixed(2) : "N/A"

		return `${longitude},${latitude},${confidence}`
	})

	const convertTimestamp = epoch => {
		const date = new Date(epoch)
		const dateString = date.toLocaleDateString("en-CA") // 'en-CA' gives us the YYYY/MM/DD format
		const timeString = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: true })
		return `${dateString} ${timeString}`
	}

	return (
		<div>
			{isProcessing && (
				<div style={{ marginTop: 20 }}>
					<progress value={progress} max={100} />
					<span>{`${Math.round(progress)}%`}</span>
				</div>
			)}

			{Object.keys(apiResponses).length > 0 && !isProcessing && (
				<>
					<div style={{ paddingTop: "20px" }}>
						<label>
							Export Title:
							<input type="text" value={exportTitle} onChange={e => setExportTitle(e.target.value)} />
						</label>
					</div>
					<br />

					<GcdsButton size="small" onClick={exportToExcel}>
						Export to Excel
					</GcdsButton>

					<GcdsButton size="small" onClick={exportToCSV} style={{ marginLeft: 10 }}>
						Export to CSV
					</GcdsButton>
					
					<GcdsButton size="small" onClick={exportToGeoJSON} style={{ marginLeft: 10 }}>
						Export to GeoJson
					</GcdsButton>
					<div>
						<h2>Results Count:</h2>
						<p>
							<strong>Lines Inputted / Lines Returned:</strong> {inputCount} / {returnedCount}
						</p>
						<div>85+%: {count_85_to_100}</div>
						<div>51-84%: {count_84_to_51}</div>
						<div>0-50%: {count_0_to_50}</div>
					</div>
					<div>
						<ul>{display_0_to_50()}</ul>
					</div>
					<div style={{ height: "500px", overflow: "auto" }}>
						<h2>Results</h2>
						<ul>
							{Object.keys(apiResponses).map((address, index) => {
								const result = apiResponses[address]
								const feature = result?.features?.[0] ?? {}
								const geocoding = result?.geocoding ?? {} // Adjusted to check if geocoding exists
								const properties = feature?.properties ?? {}
								const geometry = feature?.geometry ?? {}
								const unitNumber = processedData.find(row => row["Physical Address"] === address)?.["Unit Number"] || ""

								return (
									<li key={index}>
										<strong>Address:</strong> {unitNumber ? `${unitNumber} ${address}` : address} <br />
										<strong>Confidence:</strong> {properties.confidence !== undefined ? (properties.confidence * 100).toFixed(2) : "N/A"} % <br />
										<strong>Match Type:</strong> {properties.match_type || "Unknown"} <br />
										<strong>Accuracy:</strong> {properties.accuracy || "Unknown"} <br />
										<strong>Source:</strong> {properties.source || "Unknown"} <br />
										<strong>Date and Time (YYYY-MM-DD HH:MM:SS AM/PM) :</strong> {convertTimestamp(geocoding.timestamp) || "Unknown"} <br />{" "}
										{/* Adjusted to safely access timestamp */}
										<strong>Longitude:</strong> {geometry.coordinates ? geometry.coordinates[0] : "N/A"} <br />
										<strong>Latitude:</strong> {geometry.coordinates ? geometry.coordinates[1] : "N/A"} <br />
										<br />
									</li>
								)
							})}
						</ul>
					</div>
				</>
			)}
			{!isProcessing && (
				<div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
					<GcdsDetails detailsTitle="View the Map">
						<MapComponentOL mapContentJSON={mapContentJSON} />
					</GcdsDetails>
				</div>
			)}
			
		</div>
	)
}

FileProcessorComponent.propTypes = {
	jsonData: PropTypes.array.isRequired,
}

export default FileProcessorComponent
