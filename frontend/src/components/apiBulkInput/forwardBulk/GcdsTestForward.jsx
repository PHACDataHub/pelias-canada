/* eslint-disable react/prop-types */
import { useRef, useState, forwardRef, useImperativeHandle } from "react"

import "leaflet/dist/leaflet.css"
import { GcdsButton, GcdsHeading, GcdsFileUploader } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"

const IntakeForwardFile = forwardRef(({ setResults }, ref) => {
	const { t } = useTranslation()
	const [results, setInputtedResults] = useState([]) // State for internal results
	const [error, setError] = useState(null) // To store error messages
	const [fileName, setFileName] = useState("")
	const [isFileUploaded, setIsFileUploaded] = useState(false)
	const fileInputRef = useRef(null)

	const handleFileChange = e => {
		const file = e.target.files[0]
		if (file) {
			setIsFileUploaded(true)
			setFileName(file.name || "") // Set the file name
			setError(null) // Reset error when a new file is selected
		} else {
			setIsFileUploaded(false)
		}
	}

	const handleFileUpload = () => {
		const file = fileInputRef.current && fileInputRef.current.files ? fileInputRef.current.files[0] : null;
	  
		if (!file) {
		  setError("Please select a file to upload.");
		  return;
		}
	  
		const reader = new FileReader();
		reader.onload = (e) => {
		  try {
			let csvData = e.target.result;
			csvData = csvData.replace(/("\s*\n\s*")/g, " "); // Replace newline within quotes with a space
			processCSV(csvData);
		  } catch (err) {
			console.error("File reading error:", err);
			setError("An error occurred while reading the file.");
		  }
		};
	  
		reader.onerror = () => {
		  setError("Error occurred while reading the file. Please try again.");
		};
	  
		reader.readAsText(file);
	  };
	  
	  

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
			setError("CSV must contain inputID and physicalAddress columns.", err)
			console.error("CSV processing error:", err)
		}
	}

	const handleReset = () => {
		setInputtedResults([]) // Clear results
		setResults([]) // Clear passing results to parent
		setFileName("") // Clear file name
		setError(null) // Clear errors
		setIsFileUploaded(false) // Reset file uploaded state
		if (fileInputRef.current) {
			fileInputRef.current.value = "" // Clear file input
		}
	}

	useImperativeHandle(ref, () => ({
		reset: handleReset,
	}))

	return (
		<div>
			<ul>
				<li>Upload CSV</li>
				<li>Review cleaned data</li>
				<li>
					Continue to use API and visualize data <br />
					<i>Any items that did not return an error on initial processing will not be included in the API call and visualization.</i>
				</li>
			</ul>
			<div style={{ overflow: "auto" }}>
				<fieldset>
					<GcdsFileUploader
						accept=".csv"
						hint="Upload a CSV to use our service"
						uploaderId="uploader"
						label={t("components.forwardBulk.InputUpload.title")}
						name="file-uploader"
						ref={fileInputRef}
						onGcdsChange={handleFileChange}
						errorMessage={error || ""} // Display error message here
						onGcdsRemoveFile={handleReset}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "185px",
							paddingTop: "20px",
						}}
					>
						<GcdsButton size="small" onClick={handleFileUpload}>
							Submit
						</GcdsButton>
					</div>
				</fieldset>
			</div>
			{results.length > 0 && (
				<>
					<GcdsHeading tag="h3" characterLimit="false">
						Displaying information for uploaded file: {fileName}
					</GcdsHeading>
				</>
			)}
		</div>
	)
})
IntakeForwardFile.propTypes = {
	setResults: PropTypes.func.isRequired, // Validate setResults as a function
}

export default IntakeForwardFile
