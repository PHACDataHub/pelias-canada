/* eslint-disable react/prop-types */
import { useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import { GcdsButton, GcdsHeading } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"

IntakeForwardFile.propTypes = {
	setResults: PropTypes.func.isRequired, // Validate setResults as a function
}

export default function IntakeForwardFile({ setResults }) {
	const { t } = useTranslation()
	const [results, setInputtedResults] = useState([]) // State for internal results
	const [error, setError] = useState(null) // To store error messages
	const [fileName, setFileName] = useState("")

	const fileInputRef = useRef(null)

	const [isFileUploaded, setIsFileUploaded] = useState(false)

	const handleFileChange = e => {
		if (e.target.files.length > 0) {
			setIsFileUploaded(true)
			setFileName(e.target.files[0].name || "") // Set the file name
			setError(null) // Reset error when a new file is selected
		} else {
			setIsFileUploaded(false)
		}
	}

	const handleFileUpload = () => {
		const file = fileInputRef.current.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				try {
					let csvData = e.target.result
					csvData = csvData.replace(/("\s*\n\s*")/g, " ") // Replace newline within quotes with a space
					processCSV(csvData)
				} catch (err) {
					setError("Error reading file. Please try again.")
					console.error("File reading error:", err)
				}
			}
			reader.onerror = () => {
				setError("Error occurred while reading the file. Please try again.")
			}
			reader.readAsText(file)
		} else {
			setError("Please select a file to upload. ")
		}
	}

	const processCSV = data => {
		try {
			const lines = data.split("\n").filter(line => line.trim() !== "")
			const headers = lines[0].split(",").map(header => header.trim().toLowerCase())

			// Check if CSV contains the necessary columns
			if (!headers.includes("inputid") || !headers.includes("physicaladdress")) {
				throw new Error("CSV must contain inputID and physicalAddress columns.")
			}

			const processedResults = []
			const errors = []

			// Process each line in the CSV file (skip the header)
			lines.slice(1).forEach((line, index) => {
				try {
					const cols = line.split(",")
					const inputID = cols[headers.indexOf("inputid")]
					const addressParts = cols.slice(headers.indexOf("physicaladdress")).join(",").replace(/^"|"$/g, "").trim()

					// Check for missing inputID or physicalAddress
					if (!inputID || !addressParts) {
						errors.push(`Line ${index + 2}: Missing required fields (inputID or physicalAddress)`)
					} else {
						processedResults.push({
							inputID,
							physicalAddress: addressParts,
						})
					}
				} catch (err) {
					errors.push(`Line ${index + 2}: Error processing line. ${err.message}`)
					console.error(`Error processing line ${index + 2}:`, err)
				}
			})

			if (errors.length > 0) {
				setError(errors.join("\n")) // Show all errors found in the CSV
			} else {
				setResults(processedResults) // Lift results to parent component
				setInputtedResults(processedResults) // Only set results if no errors occurred
			}
		} catch (err) {
			setError("CSV must contain inputID and physicalAddress columns. ", err)
			console.error("CSV processing error:", err)
		}
	}
	const handleReset = () => {
		setInputtedResults([]) // Clear results
		setResults([]) // Clear passing results to ForwardCallAPIReturn
		setFileName("") // Clear file name
		setError(null) // Clear errors
		setIsFileUploaded(false) // Reset file uploaded state
		if (fileInputRef.current) {
			fileInputRef.current.value = "" // Clear file input
		}
	}
	return (
		<div >
			{results.length > 0 ? (
				<>
					<GcdsHeading tag="h2" characterLimit="false">
						Displaying information for Uploaded file: {fileName}
					</GcdsHeading>
					<GcdsButton onClick={handleReset}>Reset</GcdsButton>
				</>
			) : (
				<fieldset>
					<legend>{t("components.forwardBulk.InputUpload.title")}</legend>
					<input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
					{/* Show error message if there's any */}
					{error && (
						<div style={{ color: "red", whiteSpace: "pre-line" }}>
							{/* Display error messages with line numbers */}
							{error}
						</div>
					)}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "185px",
							paddingTop: "20px",
						}}
					>
						<GcdsButton size="small" onClick={handleFileUpload} disabled={!isFileUploaded}>
							submit
						</GcdsButton>
					</div>
				</fieldset>
			)}
		</div>
	)
}
