/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"
import PropTypes from "prop-types"
import { GcdsButton, GcdsDetails, GcdsErrorMessage, GcdsText } from "@cdssnc/gcds-components-react"

export default function ForwardCallAPIReturn({ results }) {
	const [totalRowsSubmitted, setTotalRowsSubmitted] = useState(0)
	const [parsedResults, setParsedResults] = useState([])
	const [inputtedResults, setInputtedResults] = useState([])

	useEffect(() => {
		setTotalRowsSubmitted(results.length)
		setInputtedResults(results)
		// Parse each result to extract address components
		const breakdownResults = results.map(result => {
			const addressComponents = parseAddress(result.physicalAddress)
			return { ...result, ...addressComponents }
		})

		setParsedResults(breakdownResults)
	}, [results])

	// Function to parse a physical address
	const parseAddress = address => {
		// Remove trailing quotes and trim
		let cleanedAddress = address.replace(/"$/, "").trim()

		// Define default components
		let apartment = null
		let streetNumber = null
		let streetName = null
		let region = null
		let province = null
		let postalCode = null

		// Regex to extract postal code
		const postalRegex = /[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/
		const postalMatch = cleanedAddress.match(postalRegex)
		if (postalMatch) {
			postalCode = postalMatch[0]
			cleanedAddress = cleanedAddress.replace(postalCode, "").trim()
		}

		// Regex for province and region (e.g., QC, ON)
		const provinceRegionRegex = /,\s*([^,]+),\s*([A-Za-z]{2})$/
		const regionProvinceMatch = cleanedAddress.match(provinceRegionRegex)
		if (regionProvinceMatch) {
			region = regionProvinceMatch[1].trim()
			province = regionProvinceMatch[2].trim()
			cleanedAddress = cleanedAddress.replace(regionProvinceMatch[0], "").trim()
		}

		// Handle special cases
		switch (true) {
			case cleanedAddress.startsWith("P.O. Box"):
			case cleanedAddress.startsWith("PO Box"):
			case cleanedAddress.startsWith("Box"):
				streetName = cleanedAddress.trim()
				cleanedAddress = ""
				break
			case cleanedAddress.startsWith("RR#"):
			case cleanedAddress.startsWith("RR"):
				streetName = cleanedAddress.trim()
				cleanedAddress = ""
				break
			case /^C\.P\./.test(cleanedAddress):
				streetName = cleanedAddress.trim()
				cleanedAddress = ""
				break
			case /\b(North|South|East|West)\b/.test(cleanedAddress):
				streetName = cleanedAddress.trim()
				cleanedAddress = ""
				break
			case /^\d+-\d+/.test(cleanedAddress): {
				const apartmentStreetRegex = /^(\d+)-(\d+)\s+(.+)/
				const match = cleanedAddress.match(apartmentStreetRegex)
				if (match) {
					apartment = match[1].trim()
					streetNumber = match[2].trim()
					streetName = match[3].trim()
				}
				cleanedAddress = ""
				break
			}
			case /\b(unité|apt|suite)\s+\d+/.test(cleanedAddress): {
				const unitRegex = /(unité|apt|suite)\s+(\d+)\s*,?\s*(.+)/i
				const unitMatch = cleanedAddress.match(unitRegex)
				if (unitMatch) {
					apartment = unitMatch[2].trim()
					cleanedAddress = unitMatch[3].trim()
				}
				break
			}
			case /Concession \d+/.test(cleanedAddress):
			case /Lot \d+/.test(cleanedAddress):
				streetName = cleanedAddress.trim()
				cleanedAddress = ""
				break
		}

		// Extract street number and name if available
		const streetRegex = /^(\d+),?\s*(.*)/
		const streetMatch = cleanedAddress.match(streetRegex)
		if (streetMatch) {
			streetNumber = streetMatch[1].trim()
			streetName = streetMatch[2].trim()
		}

		// Construct query string
		const query = `${streetNumber ? streetNumber : ""} ${streetName ? streetName : ""}, ${region ? region : ""}, ${province ? province : ""}`.trim()

		// Return parsed components
		return {
			apartment: apartment || null,
			streetNumber: streetNumber || null,
			streetName: streetName || null,
			region: region || null,
			province: province || null,
			postalCode: postalCode || null,
			query,
		}
	}

	// Filter out the items where streetName is null
	const filteredResults = parsedResults.filter(parsedResult => parsedResult.streetName !== null)

	return (
		<>
			<p>Input length: {totalRowsSubmitted}</p>
			<p>Cleaned length: {filteredResults.length}</p>
			<p>Number of errors: {parsedResults.filter(parsedResult => parsedResult.streetName === null).length}</p>

			<GcdsDetails detailsTitle="click to view inputted details">
				{inputtedResults.length > 0 && (
					<div style={{ overflow: "hidden" }}>
						<div style={{ height: "300px", overflow: "scroll" }}>
							<GcdsText>
								<pre>{JSON.stringify(inputtedResults, null, 2)}</pre>
							</GcdsText>
						</div>
					</div>
				)}
			</GcdsDetails>
			<br />
			<hr />
			<p>Cleaned length: {filteredResults.length}</p>
			<GcdsDetails detailsTitle="click to preview cleaned data">
				{filteredResults.length > 0 ? (
					<div style={{ overflow: "hidden" }}>
						<div style={{ height: "300px", overflow: "scroll" }}>
							{filteredResults.map(parsedResult => (
								<div key={parsedResult.inputID}>
									<ul>
										<li>
											<strong>Input ID:</strong> {parsedResult.inputID}
										</li>
										<li>
											<strong>Physical Address:</strong> {parsedResult.physicalAddress}
										</li>
										<li>
											<strong>Apartment:</strong> {parsedResult.apartment}
										</li>
										<li>
											<strong>Street Number:</strong> {parsedResult.streetNumber}
										</li>
										<li>
											<strong>Street Name:</strong> {parsedResult.streetName}
										</li>
										<li>
											<strong>Region:</strong> {parsedResult.region}
										</li>
										<li>
											<strong>Province:</strong> {parsedResult.province}
										</li>
										<li>
											<strong>Postal Code:</strong> {parsedResult.postalCode}
										</li>
										<li>
											<strong>Query:</strong> {parsedResult.query}
										</li>
									</ul>
								</div>
							))}
						</div>
					</div>
				) : null}
			</GcdsDetails>
			{/* Display results where streetName is null */}
			{parsedResults.some(parsedResult => parsedResult.streetName === null) && (
				<>
				<hr/>
					<p>Addresses with errors that will not be included:</p>
					<GcdsErrorMessage>Explain error - likely due to unit number or inaccurate address</GcdsErrorMessage>
					<GcdsDetails detailsTitle="click to preview errors">
					{parsedResults
						.filter(parsedResult => parsedResult.streetName === null)
						.map(parsedResult => (
							<GcdsText key={parsedResult.inputID}>{`Input ID: ${parsedResult.inputID}, Physical Address: ${parsedResult.physicalAddress}`}</GcdsText>
						))}</GcdsDetails>
				</>
			)}
			<br />
			<hr />
			<GcdsButton> continue Button</GcdsButton>
		</>
	)
}

// Prop validation
ForwardCallAPIReturn.propTypes = {
	results: PropTypes.array.isRequired,
}
