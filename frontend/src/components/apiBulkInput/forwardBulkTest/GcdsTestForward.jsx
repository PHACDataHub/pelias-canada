/* eslint-disable no-unused-vars */
import React, { useState } from "react"
import { GcdsButton, GcdsFileUploader } from "@cdssnc/gcds-components-react"

export default function GovTestForwardUploading() {
	const [fileSelected, setFileSelected] = useState(false) // State to track if a file is uploaded
	const [fileData, setFileData] = useState(null) // State to store the file content
	const [file, setFile] = useState(null) // State to store the file object

	const handleFileInput = () => {
		if (file) {
			const reader = new FileReader()

			reader.onload = () => {
				setFileData(reader.result) // Store file content in state
				console.log("File data:", reader.result) // You can log the content here or process it further
			}

			reader.onerror = () => {
				console.error("Error reading the file.")
			}

			reader.readAsText(file) // Read the file as text (adjust this based on your file type)
		} else {
			console.log("No file selected to read.")
		}
	}

	const handleFileSelect = e => {
		const selectedFile = e.target.files[0] // Get the file from the input event
		if (selectedFile) {
			setFile(selectedFile)
			setFileSelected(true) // File is selected, enable the submit button
		} else {
			setFileSelected(false) // Reset if no file is selected
			setFile(null)
		}
	}

	return (
		<div>
			<GcdsFileUploader
				uploaderId="file-uploader"
				label="Select a File"
				name="file-uploader"
				hint="Please select a file to upload."
				onGcdsInput={handleFileSelect} // Attach the file select handler
			/>
			<GcdsButton
				size="small"
				disabled={!fileSelected} // Disable if no file is selected
				onClick={handleFileInput} // Trigger file reading on button click
			>
				Submit
			</GcdsButton>
			<div>{fileSelected ? "File has been selected!" : "No file selected."}</div>
			{fileData && (
				<div>
					<h3>File Content:</h3>
					<pre>{fileData}</pre> {/* Display the file content */}
					<pre>
						{(() => {
							try {
								const parsedData = JSON.parse(fileData) // Try to parse the data as JSON
								return JSON.stringify(parsedData, null, 2) // Format the parsed JSON
							} catch (error) {
								console.error("Error parsing JSON", error)
								return fileData // If parsing fails, just display the raw file content
							}
						})()}
					</pre>
				</div>
			)}
		</div>
	)
}
